import HomeScreen from '@/pages/Home';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const DSPHome: React.FC = () => {
   const { userName, showBottomNav } = useLocalSearchParams()
  return (
    <>
      <HomeScreen userName={userName} showBottomNav={true} role="DSP" exit={false} />
    </>
  );
};


export default DSPHome;