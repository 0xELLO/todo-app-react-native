import 'react-native-gesture-handler';
import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';

import MainView from './src/screens/MainView';
import RegisterView from './src/screens/login/RegisterView';
import { useNavigationTheme } from './src/styles/theme';
import LoginView from './src/screens/login/LoginView';
import { CredentialType, UserCredentials } from './src/hooks/UserCredentials';
import { BaseService } from './src/services/BaseService';
import { paths } from './src/types/Paths';
import { ITodoCategories } from './src/domain/ITodoCategories';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStyles } from './src/styles/mainStyles';

const Drawer = createDrawerNavigator();
export const LoginStateContext = React.createContext(false);
export const AuthStateUpdateContext = React.createContext((value: boolean) => {});

const App = () => {
  const navTheme = useNavigationTheme();

  const getInitialAuthState = () : boolean => {
    const userCredentials = new UserCredentials();
    let value = false;
    userCredentials.get(CredentialType.Token).then((e) => {
      if (e === null) {value = false;}
      value = true;
    })
    return value;
  };

  const [authState, setAuthState] = useState(getInitialAuthState());

  return (
    <LoginStateContext.Provider value={authState}>
      <AuthStateUpdateContext.Provider value={setAuthState}>
        <NavigationContainer theme={navTheme}>
          {authState === true ? <CategoriesNavView /> : <DefaultNavView/>}
        </NavigationContainer> 
      </AuthStateUpdateContext.Provider>
    </LoginStateContext.Provider>

  );
};

const DefaultNavView = ()  => {
  return (
    <Drawer.Navigator  initialRouteName="Login" >
      <Drawer.Screen name="Register" component={RegisterView} />
      <Drawer.Screen name="Login" component={LoginView} />
    </Drawer.Navigator>
  )
}

const CategoriesNavView = ()  => {
  const [categories, setCategories] = useState([] as ITodoCategories[]);
  const authStateUpdateContext = useContext(AuthStateUpdateContext);
  const mainStyles = useStyles();

  const getCategories = useCallback(async () => {
    const categoriesService = new BaseService(paths.todoCategories);
    const data = await categoriesService.getAll('');
    setCategories(data as ITodoCategories[]);
  }, []);

  useEffect(() => {
    getCategories().catch();
    console.log("Hello from categories")
  }, [getCategories]);

  return (
    <>
      <Drawer.Navigator  initialRouteName="Home" drawerContent={props => {
          return (
            <SafeAreaView style={{flex: 1, justifyContent: 'space-between'}}>
              <DrawerContentScrollView {...props}>
                  <DrawerItem style={[mainStyles.buttonSecond]} label={"Logout"} onPress={() => {authStateUpdateContext(false)}}/>
                  <DrawerItemList {...props} />
              </DrawerContentScrollView>
              <View>
                  <DrawerItem  label={"Add New"} onPress={() => {getCategories()}}/>
              </View>
            </SafeAreaView>
          )
        }}>
          <Drawer.Screen  name="Cat1" component={MainView} />
          <Drawer.Screen  name="Cat2" component={MainView} />
          <Drawer.Screen  name="Cat3" component={MainView} />
      </Drawer.Navigator>
    </>
  )
}

export default App;
