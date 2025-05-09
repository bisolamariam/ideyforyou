import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from '@/components/Button';
import { router } from 'expo-router';

const AddSurvivorScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');

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
      <Button title="Invite to ideyforyou" onPress={() => console.log('Invite')} />
      <Button style={{ backgroundColor: '#F5F5F5', marginTop: 16}} title="Cancel" onPress={() => router.back()} />
      </View>
    </View>
  );
};

export default AddSurvivorScreen;

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
