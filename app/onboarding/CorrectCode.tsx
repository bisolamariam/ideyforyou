import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

export default function CorrectCode() {
  const {role} = useLocalSearchParams()
   

  useEffect(() => {
    const timer = setTimeout(() => {
       router.push({ pathname :'./LogoPage',params: {role: role}})
      // console.log(role)
    }, 2000); 

    return () => clearTimeout(timer);
  }, [router]);

  const getTextForUserType = (role: string) => {
    switch (role) {
      case 'DSP':
        return 'Looking for Safe Housing? Find it here';
      case 'REP':
        return 'Got safe housing? Offer it here';
      case 'survivor':
        return 'Looking for Safe Housing? Find it here';
      default:
        return 'Welcome!';
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.imageWrapper}>
      <Image source={require('@/assets/images/Security.png')} style={styles.image} />
    </View>
    <Text style={styles.text}>{getTextForUserType(Array.isArray(role) ? role[0] : role)}</Text>
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
  imageWrapper: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6},
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4, // Android
    borderRadius: 47
  },
  image: {
    width: 170,
    height: 170,
  },
  text: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    paddingHorizontal: 20,
    width: '100%',
  },
});