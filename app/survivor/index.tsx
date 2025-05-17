import HomeScreen from '@/pages/Home';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const SurvivorHome: React.FC = () => {
   const { userName, showBottomNav } = useLocalSearchParams()
  return (
    <>
      <HomeScreen userName={userName} showBottomNav={false} role="survivor" exit={true}/>
    </>
  );
};


export default SurvivorHome;