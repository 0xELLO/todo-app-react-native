import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';

import MainView from './src/screens/MainView';
import RegisterView from './src/screens/login/RegisterView';
import { useNavigationTheme } from './src/styles/theme';

const Drawer = createDrawerNavigator();

const App = () => {
  const navTheme = useNavigationTheme();
  return (
    <NavigationContainer theme={navTheme}>
      <Drawer.Navigator  initialRouteName="Home" drawerContent={props => {
        return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label={"test"} onPress={() => {}}/>
         </DrawerContentScrollView>);
      }}>
        <Drawer.Screen  name="Home" component={MainView} />
        <Drawer.Screen name="Register" component={RegisterView} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  appStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
