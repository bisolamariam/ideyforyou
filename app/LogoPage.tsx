import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function LogoPage() {

  useEffect(() => {
      const timer = setTimeout(() => {
        router.push({
          pathname: '/Home',
          params: { userName: 'Ishaq', showBottomNav: true },
        });
      }, 2000); 
})

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/ideyforyou-logo-deep-yellow 1.png')} style={styles.image} />
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