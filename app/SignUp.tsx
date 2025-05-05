import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Entypo';
import User from 'react-native-vector-icons/Feather';
import PhoneIcon from 'react-native-vector-icons/AntDesign'; 
import Mail from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const SignUp = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-thin-left" size={24} color="#1E1E2D" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sign Up</Text>
      </View>

      <Formik
        initialValues={{ fullName: '', phoneNumber: '', email: '' }}
        validationSchema={SignUpSchema}
        onSubmit={(values) => {
          console.log(values);
          navigation.navigate('VerifyCode');
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={{ marginTop: 30 }}>
            {/* Full Name */}
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

            {/* Phone Number */}
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

            {/* Email */}
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

            {/* Sign Up Button */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Bottom Text */}
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
