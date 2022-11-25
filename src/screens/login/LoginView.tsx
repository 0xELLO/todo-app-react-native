import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import React, { useContext, useState } from 'react';
import { useStyles } from '../../styles/mainStyles';
import { IdentityService } from '../../services/IdentityService';
import { AuthStateUpdateContext } from '../../../App';

const LoginView = () => {
  const mainStyles = useStyles();
  const is = new IdentityService();

  const authStateUpdateContext = useContext(AuthStateUpdateContext);

  const [email, setEmail] = useState('test1@test1.com');
  const [password, setPassword] = useState('Password.123');

  const login = async () => {
    console.log('Here');
    const res = await is.login(email, password);

    if (res === false) {
      authStateUpdateContext(false);
    } else {
      authStateUpdateContext(true);
    }
  };

  return (
    <View style={[styles.viewMain, mainStyles.container]}>
      <View style={styles.viewRow}>
          <Text style={mainStyles.textBlock}>Email</Text>
          <TextInput style={[styles.input, mainStyles.inputBlock]} value={email} keyboardType={'email-address'} autoComplete={'email'} placeholder="Email"
           onChangeText={text => setEmail(text)} />
      </View>
      <View style={styles.viewRow}>
          <Text style={mainStyles.textBlock}>Password</Text>
          <TextInput style={[styles.input, mainStyles.inputBlock]} value={password} secureTextEntry={true} placeholder="Password"
           onChangeText={text => setPassword(text)} />
      </View>
      <Pressable onPress={() => {login();}} style={[mainStyles.button]}><Text style={[mainStyles.titleBlock]}>Login</Text></Pressable>
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
    marginBottom: 10,
  },
  input: {
    width: '66%',
  },
});
