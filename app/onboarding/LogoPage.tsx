import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { supabase} from '../../lib/supabase'
export default function LogoPage() {
  const {role} = useLocalSearchParams()

//   useEffect(() => {
//       const timer = setTimeout(() => {
//         router.push({
//           pathname: '/Home',
//           params: { userName: 'Ishaq', showBottomNav: true },
//         });
//       }, 2000); 
// })

useEffect(() => {
  (async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData?.user) {
        // console.log('Auth Error:', authError);
        router.push('./SignUp');
        return;
      }

      const userId = authData.user.id;
      // console.log(authData, "this is auth data")
      // console.log('User ID:', userId);
      const { data: profile, error: profileError } = await supabase
      .from(`${role}`)
      .select('name')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      // console.log('Profile Error:', profileError);
      router.push('/SignUp');
      return;
    }

    const fullName = profile.name || 'User';
    const firstName = fullName.split(' ')[0];
    // const role = profile.role;

    router.push({
      pathname: `../${role}`,
      params: { userName: firstName, showBottomNav: role === 'DSP' },
    });
  } catch (error) {
    // console.error('Unexpected Error:', error);
    router.push('/SignUp');
  }
})();

}, [])

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/ideyforyou-logo-deep-yellow 1.png')} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
});