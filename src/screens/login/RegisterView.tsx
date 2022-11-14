import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useStyles } from '../../styles/mainStyles';

const RegisterView = () => {
  const mainStyles = useStyles();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={[styles.viewMain, mainStyles.container]}>
      <Text style={[mainStyles.titleBlock, styles.label]}>Register</Text>
      <View style={styles.viewRow}>
          <Text style={mainStyles.textBlock}>Email</Text>
          <TextInput style={[styles.input, mainStyles.inputBlock]} value={email} keyboardType={"email-address"} autoComplete={"email"} onChangeText={text => setEmail(text)}  placeholder="Email" />
      </View>
      <View style={styles.viewRow}>
          <Text style={mainStyles.textBlock}>First name</Text>
          <TextInput style={[styles.input, mainStyles.inputBlock]} value={firstName} onChangeText={text => setFirstName(text)} placeholder="First Name" />
      </View>
      <View style={styles.viewRow}>
          <Text style={mainStyles.textBlock}>Last name</Text>
          <TextInput style={[styles.input, mainStyles.inputBlock]} value={lastName} onChangeText={text => setLastName(text)}  placeholder="Last Name" />
      </View>
      <View style={styles.viewRow}>
          <Text style={mainStyles.textBlock}>Password</Text>
          <TextInput style={[styles.input, mainStyles.inputBlock]} value={password} onChangeText={text => setPassword(text)}  secureTextEntry={true} placeholder="Password" />
      </View>
      <Pressable onPress={() => {}} style={[mainStyles.button]}><Text style={[mainStyles.titleBlock]}>Register</Text></Pressable>
    </View>

  );
};

export default RegisterView;

const styles = StyleSheet.create({
  viewMain: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewRow: {
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    marginBottom: 10
  },
  input: {
    width: '66%',
  },
});
