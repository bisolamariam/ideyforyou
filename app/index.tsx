import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ImageBackground, Alert, StatusBar } from 'react-native';
import Button  from '../components/Button';  
import { router, useGlobalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext'
import { Linking } from 'react-native';
const API_KEY = 'd56c2e8dd0f2d59d20fb011274dc734e'; 

const dummyData = {
  main: {
    temp: 25,
    temp_min: 20,
    temp_max: 30,
  },
  weather: [
    { description: 'clear sky' },
  ],
};

const WeatherScreen: React.FC = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
 const [appLoading, setAppLoading] = useState(false)
const { user, loading: authLoading, refreshSession } = useAuth();
const params = useGlobalSearchParams();
  const fetchWeather = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'heyy'
        // `https://api.openweathermap.org/data/2.5/weather?q=Chicago&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setWeather(dummyData);
    } finally {
      setLoading(false);
    }
  };

const handleClick = async () => {
  setAppLoading(true);
 
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      console.log('Error fetching user:', error);
      router.push('./onboarding');
      return;
    }
console.log(user, "this is user from click")


    const role = user?.user_metadata.role;
    const fullName = user?.user_metadata.name || 'User';
    const firstName = fullName.split(' ')[0];
console.log(role, "role from click")
    if (role === 'survivor') {
       router.replace({
              pathname: './survivor',
              params: { userName: firstName, showBottomNav: false },
            });
    } else if (role === 'DSP' || role === 'REP') {
      console.log(`know youre ${role}`)
      const { data: profile, error: profileError } = await supabase
        .from(`${role}`)
        .select('onboarding_complete')
        .eq('id', user?.id)
        .single();

      if (profileError) {
        console.log('Error fetching profile:', profileError);
        router.push('./onboarding');
        return;
      }

      if (profile?.onboarding_complete) {
        console.log('Onboarding complete, navigating to DSP home');
         router.replace({
              pathname: `./${role}`,
              params: { userName: firstName, showBottomNav: role === 'DSP'},
            });
      } else {
        router.push('./onboarding');
      }
    }
  } catch (error) {
    console.error('Unexpected error in handleClick:', error);
    router.push('./onboarding');
  } finally {
    setAppLoading(false); 
  }
};

const getSurvivorEmail = async () => {
  const {data: profile, error} = await supabase
  .from('Survivors')
  .select('email')
}

const handleMagicLink = async () => {
  const initialUrl = await Linking.getInitialURL();
  console.log('Initial URL:', initialUrl);

  if (!initialUrl) return;

  try {
    const url = new URL(initialUrl);
    const hash = url.hash;
    
    const params = new URLSearchParams(hash.replace(/^#/, ''));

    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    // console.log('access_token:', access_token);
    // console.log('refresh_token:', refresh_token);

    if (access_token && refresh_token) {
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        Alert.alert('Login Error', error.message);
      } else {
        // console.log('Session set successfully');
        await refreshSession();
      }
    }
  } catch (error) {
    console.error('Error parsing magic link:', error);
  }
};

useEffect(() => {
  handleMagicLink()
}, [])

useEffect(() => {
  fetchWeather();
}, []);

  if (loading || authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.centered}>
        <Text>Failed to load weather data.</Text>
      </View>
    );
  }

  const temp = weather?.main?.temp ? Math.round(weather.main.temp) : dummyData.main.temp;
  const tempMin = weather?.main?.temp_min ? Math.round(weather.main.temp_min) : dummyData.main.temp_min;
  const tempMax = weather?.main?.temp_max ? Math.round(weather.main.temp_max) : dummyData.main.temp_max;
  const condition = weather?.weather?.[0]?.description || dummyData.weather[0].description;

  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor="#000" />
   
    <View style={styles.container}>
      <Text style={styles.title}>WEATHER APP</Text>
      <ImageBackground 
        source={require('@/assets/images/weather.png')} 
        style={styles.card} 
        imageStyle={styles.imageBackground}
      >
        <Text style={styles.city}>Chicago</Text>
        <Text style={styles.temp}>{temp}°C</Text>
        <View style={styles.row}>
          <View style={styles.rowTemp}>
            <Text style={styles.range}>H:{tempMax}°C</Text>
            <Text style={styles.range}>L:{tempMin}°C</Text>
          </View>
          <Text style={styles.condition}>{condition}</Text>
        </View>
      </ImageBackground>

      <View style={styles.buttonContainer}>
        <Button
          title="Check for Updates"
          iconName="arrow-down-circle"
          onPress={handleClick} 
          loading={appLoading}
        />
      </View>
    </View>
     </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    marginTop: 40,
    marginBottom: 20,
    letterSpacing: 2,
  },
  card: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: 16,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  city: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 20
  },
  temp: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    marginLeft: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginHorizontal: 20,
    marginBottom: 20
  },
  rowTemp:{
    flexDirection: 'row',
    gap: 8
  },
  range: {
    color: '#fff',
    fontSize: 14,
  },
  condition: {
    color: '#fff',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 200,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WeatherScreen;
