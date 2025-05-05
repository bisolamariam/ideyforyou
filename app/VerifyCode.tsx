import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import {Colors} from '../constants/Colors';
import Button from '../components/Button'; // using our reusable button now!
import Dot from '../components/Dot';
import { useNavigation } from 'expo-router';

const VerifyCode = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation()
  const inputs = useRef<Array<TextInput | null>>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) text = text.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every(val => val.length === 1)) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (enteredCode: string) => {
    setLoading(true);
    setTimeout(() => { // simulate API
      if (enteredCode === '1234') {
        console.log('Correct Code');
        setError(false);
        navigation.navigate('CorrectCode')
      } else {
        console.log('Incorrect Code');
        setError(true);
        triggerShake();
      }
      setLoading(false);
    }, 1000);
  };

  const handleResend = () => {
    console.log('Resend Code');
    setOtp(['', '', '', '']);
    inputs.current[0]?.focus();
    setError(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      style={styles.container}
    >
      {error && <Text style={styles.errorText}>Incorrect code</Text>}

      <Text style={styles.title}>Enter confirmation code</Text>
      <Text style={styles.subtitle}>A 4-digit code was sent to michael@exp.com</Text>

      <Animated.View style={[styles.otpContainer, { transform: [{ translateX: shakeAnim }] }]}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={[
              styles.otpInput,
              error ? styles.errorBorder : focusedInput === index ? styles.focusedBorder : undefined,
            ]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => {
              setFocusedInput(index);
              setError(false);
            }}
            onBlur={() => setFocusedInput(null)}
          />
        ))}
      </Animated.View>
      <TouchableOpacity style={styles.resendText} onPress={handleResend}>
        <Dot/>
        <Text style={{color: Colors.primary}}> Resend code</Text>
        <Dot/>
      </TouchableOpacity>

      <Button 
        title="Continue" 
        onPress={() => handleSubmit(otp.join(''))}
        loading={loading}
      />
   
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingTop: 120,
    alignItems: 'center',
   
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 8,
    fontFamily: 'Urbanist'
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 32,
    width: 200,
    textAlign: 'center',
    fontFamily: 'Urbanist'
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.textLight,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    color: Colors.textDark,
    
  },
  errorBorder: {
    borderColor: 'red',
  },
  focusedBorder: {
    borderColor: Colors.primary,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  resendText: {
    color: Colors.primary,
    marginTop: 100,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  resendandbtn: {
    marginTop: 20
  }
});

export default VerifyCode;
