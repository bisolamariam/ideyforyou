import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Button from '@/components/Button';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
 
const AddSurvivors: React.FC = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false)
const { user } = useAuth()
  const handleInviteSurvivor = async () => {
    setLoading(true)
     try {
    const response = await fetch(`https://zuafoaugcognfgfrxben.supabase.co/functions/v1/invite-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${user?.access_token}`, // optional if your edge function is protected
      },
      body: JSON.stringify({
        name,
        contact,
        notes,
        invited_by: user?.email,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // console.error('Invite failed:', result);
      Alert.alert('Error', result.error || 'Failed to invite survivor.');
      return;
    }
    // console.log("link should be here", result)
    Alert.alert('Success', result.message);
    router.back();
  } catch (err) {
    console.error('Unexpected error:', err);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  } finally {
    setLoading(false)
  }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Preferred Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name or alias"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email or Phone (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email or phone number"
        value={contact}
        onChangeText={setContact}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Private Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter notes"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
<View style={styles.buttons}>
      <Button title="Invite to ideyforyou" loading={loading} onPress={handleInviteSurvivor} />
      <Button style={{ backgroundColor: '#F5F5F5', marginTop: 16}} title="Cancel" onPress={() => router.back()} />
      </View>
    </View>
  );
};

export default AddSurvivors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
    marginTop: 16,
    fontFamily: 'Urbanist-Regular'
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 13.5,
    fontSize: 17,
  },
  buttons: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 22
  }
});
