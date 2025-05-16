import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated, Alert } from 'react-native';
import {Colors} from '../../constants/Colors';
import Button from '../../components/Button'; 
import Dot from '../../components/Dot';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import {supabase} from '../../lib/supabase'
const VerifyCode = () => {
  const {fullName, phoneNumber,email, role} = useLocalSearchParams()
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
 
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

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every(val => val.length === 1)) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' /*&& otp[index] === ''*/ && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (enteredCode: string) => {
    setLoading(true);
    const emailString = Array.isArray(email) ? email[0] : email;
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: emailString,
        token: enteredCode,        
        type: 'email',
      })
      if(error){
        throw error
      }
     const {error: databaseError} = await supabase.from(`${role}`).insert({
        id: data?.user?.id,
        name: fullName,
        email: email,
        phone_number: phoneNumber,
        role: `${role}`,
        onboarding_complete: true
      })
      if(databaseError){
        Alert.alert('Failed to create user profile. Please try again.', databaseError.message);
        return
      }

         const { data: userData, error: userError } = await supabase.auth.updateUser({
            data: {
                name: fullName,
                email: email,
                role: `${role}`,
            },
          });
      
          if (userError) {
            console.error(userError)
             Alert.alert('Error', 'Failed to update user metadata. Please try again.');
            return;
          }

      router.push({ pathname :'./CorrectCode',params: {role: role}})
    } catch (err) {
      setError(true);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    console.log('Resend Code');
    setOtp(['', '', '', '', '', '']);
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
      <Text style={styles.subtitle}>{`A 6-digit code was sent to ${email}`}</Text>

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
    width: '100%',
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
