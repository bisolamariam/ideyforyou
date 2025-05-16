import HomeScreen from '@/pages/Home';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const REPHome: React.FC = () => {
   const { userName, showBottomNav } = useLocalSearchParams()
  return (
    <>
      <HomeScreen userName={userName} showBottomNav={false} role="REP" />
    </>
  );
};


export default REPHome;