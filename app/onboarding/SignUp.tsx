import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Entypo';
import User from 'react-native-vector-icons/Feather';
import PhoneIcon from 'react-native-vector-icons/AntDesign'; 
import Mail from 'react-native-vector-icons/Ionicons' 
import { Picker } from '@react-native-picker/picker'
import {supabase} from '../../lib/supabase'
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { showAlert } from '@/lib/showAlert';
const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
});

const SignUp = () => {
 
  const [loading, setLoading] = useState(false)

  const sendVerificationCode = async ({fullName, phoneNumber, email, role } : {
    fullName: string;
    phoneNumber: string;
    email: string;
    role: string;
  }) => {
    setLoading(true)
    try {
      // console.log(email)
  const dspResult = await supabase
      .from('DSP')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (dspResult.error && dspResult.error.code !== 'PGRST116') {
      // console.error('Error checking DSP table:', dspResult.error);
      setLoading(false);
      return;
    }

    if (dspResult.data) {
      showAlert('Account Exists', 'An account with this email already exists. Please log in.');
      setLoading(false);
      return;
    }

    const repResult = await supabase
      .from('REP')
      .select('id')
      .eq('email', email.trim())
      .maybeSingle();

    if (repResult.error && repResult.error.code !== 'PGRST116') {
      // console.error('Error checking REP table:', repResult.error);
      setLoading(false);
      return;
    }

    if (repResult.data) {
      showAlert('Account Exists', 'An account with this email already exists. Please log in.');
      setLoading(false);
      return;
    }
    // console.log('DSP Result:', dspResult);
// console.log('REP Result:', repResult)

  

    // if (dspResult.error && dspResult.error.code !== 'PGRST116') {
    //   // console.error('Error checking DSP table:', dspResult.error);
    //   setLoading(false);
    //   return;
    // }

    // if (repResult.error && repResult.error.code !== 'PGRST116') {
    //   // console.error('Error checking REP table:', repResult.error);
    //   setLoading(false);
    //   return;
    // }

    // if (existingUserInDSP || existingUserInREP) {
    //   showAlert('Account Exists', 'An account with this email already exists. Please log in.');
    //   setLoading(false);
    //   return;
    // }
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
        },
      })
      
      if (error) {
    throw error
      }

    router.push({
      pathname: './VerifyCode',
      params: { fullName, phoneNumber, email,role },
    });
  } catch (error) {
    // console.error('Error sending verification code:', error);
    showAlert('Error', 'Failed to send verification code. Please try again.');
  } finally {
    setLoading(false)
  }
};
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={() =>  router.back()}>
          <Icon name="chevron-thin-left" size={24} color="#1E1E2D" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sign Up</Text>
      </View>

      <Formik
        initialValues={{ fullName: '', phoneNumber: '', email: '', role: '' }}
        validationSchema={SignUpSchema}
        onSubmit={(values) => {
         
          sendVerificationCode(values)
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue  }) => (
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

              <Text style={styles.title}>Role</Text>
            <View style={styles.inputWrapper}>
              <Picker
                selectedValue={values.role}
                onValueChange={(itemValue) => setFieldValue('role', itemValue)}
                style={{ flex: 1, border: 'none',  outlineStyle: 'none' }}
              >
                <Picker.Item label="Select Role" value="" />
                <Picker.Item label="Domestic Service Provider" value="DSP" />
                <Picker.Item label="Real Estate Partner" value="REP" />
              </Picker>
            </View>
            {errors.role && touched.role && <Text style={styles.errorText}>{errors.role}</Text>}


          
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              { loading ?  (<ActivityIndicator color={Colors.textDark} />) : (
              <Text style={styles.submitBtnText}>Sign Up</Text>
            )}
            </TouchableOpacity>

           
            <View style={styles.bottomTextContainer}>
              <Text style={styles.bottomText}>Already have an account? </Text>
              <TouchableOpacity>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
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
    borderColor: '#F4F4F4',
     outlineStyle: 'none'
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
    marginTop: 69,
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
