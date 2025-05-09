import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Entypo';
import User from 'react-native-vector-icons/Feather';
import PhoneIcon from 'react-native-vector-icons/AntDesign'; 
import Mail from 'react-native-vector-icons/Ionicons' 
import {supabase} from '../lib/supabase'
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const SignUp = () => {
 
  const [loading, setLoading] = useState(false)

  const sendVerificationCode = async ({fullName, phoneNumber, email } : {
    fullName: string;
    phoneNumber: string;
    email: string;
  }) => {
    setLoading(true)
    try {
      const { data: existingUser, error: checkError } = await supabase
      .from('Profiles') 
      .select('id')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
     console.error('Error checking for existing user:', checkError);
     setLoading(false)
     return
    }

    if (existingUser) {
      Alert.alert('Account Exists', 'An account with this email already exists. Please log in.');
      setLoading(false);
      return;
    }
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        },
      })
      
      if (error) {
    throw error
      }
      setLoading(false)
    router.push({
      pathname: 'VerifyCode',
      params: { fullName, phoneNumber, email },
    });
  } catch (error) {
    setLoading(false)
    console.error('Error sending verification code:', error);
    Alert.alert('Error', 'Failed to send verification code. Please try again.');
  }
};
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={() =>  router.back()}>
          <Icon name="chevron-thin-left" size={24} color="#1E1E2D" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sign Up</Text>
      </View>

      <Formik
        initialValues={{ fullName: '', phoneNumber: '', email: '' }}
        validationSchema={SignUpSchema}
        onSubmit={(values) => {
         
          sendVerificationCode(values)
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={{ marginTop: 30 }}>
          
            <Text style={styles.title}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <User name="user" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                // placeholder="Full Name"
                style={styles.input}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                value={values.fullName}
              />
            </View>
            {errors.fullName && touched.fullName && (
              <Text style={styles.errorText}>{errors.fullName}</Text>
            )}

          
            <Text style={styles.title}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <PhoneIcon name="phone" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                // placeholder="Phone Number"
                style={styles.input}
                keyboardType="phone-pad"
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
                value={values.phoneNumber}
              />
            </View>
            {errors.phoneNumber && touched.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}

         
            <Text style={styles.title}>Email Address</Text>
            <View style={styles.inputWrapper}>

              <Mail name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                // placeholder="Email Address"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
            </View>
            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

          
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              { loading ?  (<ActivityIndicator color={Colors.textDark} />) : (
              <Text style={styles.submitBtnText}>Sign Up</Text>
            )}
            </TouchableOpacity>

           
            <View style={styles.bottomTextContainer}>
              <Text style={styles.bottomText}>Already have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signInText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'column',
    marginTop: 10,
    gap: 53
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: '500',
    marginLeft: 10,
    color: '#1E1E2D',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#F4F4F4',
    borderBottomWidth: 1.5,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: 'white',
    borderColor: '#F4F4F4'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  submitBtn: {
    backgroundColor: '#FFC107',
    borderRadius: 16,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 124,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E1E2D',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  bottomText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  signInText: {
    fontSize: 14,
    color: '#FFC107',
    fontWeight: '600',
  },
  title: {
     fontSize: 14, fontWeight: '400', color: '#A2A2A7' }
});

export default SignUp;
