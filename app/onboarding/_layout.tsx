import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function OnboardingLayout() {
  return(
    <>
     <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
     <Stack screenOptions={{ headerShown: false }} />
     </>
  )
  
}
