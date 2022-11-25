import { View, Text, Pressable } from 'react-native';
import React, { useContext } from 'react';
import { useStyles } from '../../styles/mainStyles';
import { AuthStateUpdateContext } from '../../../App';
import { UserCredentials } from '../../util/UserCredentials';

const LogoutView = () => {
  const mainStyle = useStyles();
  const authStateUpdateContext = useContext(AuthStateUpdateContext);

  const LogOutButton = async () => {
    authStateUpdateContext(false);
    const userCredentials = new UserCredentials();
    await userCredentials.deleteAll();
  };
  return (
    <View style={mainStyle.container}>
      <Text style={mainStyle.titleBlock}>Are you sure you want to log out?</Text>
      <Pressable onPress={() => LogOutButton()} style={mainStyle.button}><Text style={mainStyle.titleBlock}>Logout</Text></Pressable>
    </View>
  );
};

export default LogoutView;
