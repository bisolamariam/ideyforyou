import { supabase } from '@/lib/supabase';
import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
interface HomeScreenProps {
  userName: string;
  showBottomNav: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ userName, showBottomNav, role } ) => {
   
   const logOut = async () => {
    try {
      await supabase.auth.signOut(); 
      router.replace('./onboarding'); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {userName}</Text>


            <View style={styles.content}>
      <View style={styles.card}>
        <Image
          source={require('@/assets/images/Home.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.title}>Gida</Text>
        <Text style={styles.subtitle}> {role === 'DSP'
              ? 'Looking for Safe Housing? Find it here!'
              : role === 'REP'
              ? 'Got Safe Housing? Offer it here!'
              : 'Looking For Safe Housing? Find it here!'}
       </Text>
      </View>

      <Text style={styles.questionText}>Have immediate questions?</Text>
      <TouchableOpacity>
        <Text style={styles.askLink}><Icon name="headset-mic" size={16} color="black" /> Ask Circe</Text>
      </TouchableOpacity>
      </View>
        <View style={[styles.bottomNav, { display: showBottomNav ? 'flex' : 'none' }]}>
          <TouchableOpacity style={styles.navButton} onPress={logOut}>
          <Icon name="list" size={24} color="#000" /> 
            <Text style={styles.navText}>Gida List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/DSP/AddSurvivors')}>
          <Icon name="person-add" size={24} color="#000" /> 
          
            <Text style={styles.navText}> Add Survivors</Text>
          </TouchableOpacity>
        </View>
    
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    // justifyContent: 'space-between'
    // alignItems: 'center'
   
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    
  },

   content: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 'auto',
    paddingVertical: 23,
    paddingHorizontal: 16,
    width: 266,
    height: 266
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 400,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  questionText: {
    textAlign: 'center',
    marginTop: 16,
    fontWeight: 500,
    fontSize: 20,
    color: '#333',
  },
  askLink: {
    color: '#F8B500',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 9,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
  },
});
