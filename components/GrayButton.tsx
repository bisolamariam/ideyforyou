// components/GrayButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface GrayButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

const GrayButton: React.FC<GrayButtonProps> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default GrayButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  text: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
});
