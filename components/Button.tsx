import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import {Colors} from '../constants/Colors'; 
import Feather from 'react-native-vector-icons/Feather'
interface ButtonProps {
  title: string;
  onPress: () => void;
  iconName?: string;   
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, iconName, loading = false, disabled = false, style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={Colors.textDark} />
      ) : (
        <>
          {iconName && (
            <Feather
              name={iconName}
              size={20}
              color={Colors.textDark}
              style={styles.icon}
            />
          )}
          <Text style={styles.buttonText}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonText: {
    color: Colors.textDark,
    fontWeight: '700',
    fontSize: 16,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  icon: {
    marginRight: 8,
  },
});

export default Button;
