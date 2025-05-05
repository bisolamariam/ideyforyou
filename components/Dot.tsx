import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors} from '../constants/Colors'
const Dot = () => {
  return (
    <View style={[styles.dot, { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary }]} />
  );
};

const styles = StyleSheet.create({
  dot: {
    
  },
});

export default Dot;