import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useStyles } from '../../styles/mainStyles';
import { IdentityService } from '../../services/IdentityService';

const LoginView = () => {
  const mainStyles = useStyles();
  const is = new IdentityService();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    await is.login(email, password);
  };

  return (
    <View style={[styles.viewMain, mainStyles.container]}>
      <Text style={[mainStyles.titleBlock, styles.label]}>Register</Text>
      <View style={styles.viewRow}>
          <Text style={mainStyles.textBlock}>Email</Text>
          <TextInput style={[styles.input, mainStyles.inputBlock]} value={email} keyboardType={"email-address"} autoComplete={"email"} onChangeText={text => setEmail(text)}  placeholder="Email" />
      </View>
      <View style={styles.viewRow}>
          <Text style={mainStyles.textBlock}>Password</Text>
          <TextInput style={[styles.input, mainStyles.inputBlock]} value={password} onChangeText={text => setPassword(text)}  secureTextEntry={true} placeholder="Password" />
      </View>
      <Pressable onPress={() => {register()}} style={[mainStyles.button]}><Text style={[mainStyles.titleBlock]}>Login</Text></Pressable>
    </View>

  );
};

export default LoginView;

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
