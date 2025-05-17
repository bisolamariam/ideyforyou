import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
export default function Layout() {
  const [fontsLoaded] = useFonts({
  'Urbanist-Regular': require('@/assets/fonts/Urbanist-Regular.ttf'),
  'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return ( 
    <AuthProvider>
      <SafeAreaProvider>

       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
  <Stack screenOptions={{ headerShown: false }} />
  <Toast/>
      </SafeAreaProvider>
  </AuthProvider>
)
}