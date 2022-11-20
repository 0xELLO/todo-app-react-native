import 'react-native-gesture-handler';
import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
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
import { IdentityService } from './src/services/IdentityService';
import CategoriesView from './src/screens/categories/CategoriesView';
import { set } from 'react-native-reanimated';

const Drawer = createDrawerNavigator();
export const LoginStateContext = React.createContext(false);
export const AuthStateUpdateContext = React.createContext((value: boolean) => {});

export const CategoriesContext = React.createContext([] as ITodoCategories[]);
export const CategoriesUpdateContext = React.createContext((value: ITodoCategories[]) => {});
export const CategoriesCallbackContext = React.createContext(() => {});
export const CategoriesDeleteContext = React.createContext((id: string) => {});
export const CategoriesChangeContext = React.createContext(() => {});

const App = () => {
  const navTheme = useNavigationTheme();

  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    const getInitialAuthState = async () => {
      const userCredentials = new UserCredentials();
      const res = await userCredentials.get(CredentialType.Token);
      if (res == null) {
        setAuthState(false);
      } else {
        const identityService = new IdentityService();
        const ress = await identityService.refreshToken();
        setAuthState(ress);
      }
    }
    getInitialAuthState();
  }, []);

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
    const categoriesService = new BaseService<ITodoCategories>(paths.todoCategories);
    const data = await categoriesService.getAll('Categories');
    data!.sort((a, b) => (a.categorySort < b.categorySort) ? -1 : 1);
    setCategories(data as ITodoCategories[]);
  }, []);

  const deleteCategory = async (id: string) => {
    setCategories(curr => {return curr.filter(category => category.id !== id)})
    updatePostion(categories)
    const categoriesService = new BaseService<ITodoCategories>(paths.todoCategories);
    await categoriesService.delete('Categories', id);
    await getCategories();
  }

  const updatePostion = async (data: ITodoCategories[]) => {
    const categoriesService = new BaseService<ITodoCategories>(paths.todoCategories);
    let index = 1;
    for (const cat of data) {
      cat.categorySort = index;
      await categoriesService.change('Categories' ,cat, cat.id as string);
      index++;
    }
    await getCategories();
  }

  useEffect(() => {
    getCategories().catch();
  }, [getCategories]);

  return (
    <>
      <CategoriesContext.Provider value={categories}>
      <CategoriesCallbackContext.Provider value={getCategories}>
      <CategoriesUpdateContext.Provider value={setCategories}>
      <CategoriesChangeContext.Provider value={updatePostion}>
      <CategoriesDeleteContext.Provider value={deleteCategory}>

        <Drawer.Navigator  initialRouteName="Home" drawerContent={props => {
            return (
              <SafeAreaView style={{flex: 1, justifyContent: 'space-between'}}>
                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>
                <View>
                    <DrawerItem style={[mainStyles.buttonSecond]} label={"Logout"} onPress={() => {authStateUpdateContext(false)}}/>
                </View>
              </SafeAreaView>
            )
          }}>
            <>
            <Drawer.Screen  name="All Categories"  component={CategoriesView} />
              <>
              {categories.map((cat) => {
                  return <Drawer.Screen key={cat.id} name={cat.categoryName} component={MainView} />
              })}
              </>
            </>
        </Drawer.Navigator>

      </CategoriesDeleteContext.Provider >
      </CategoriesChangeContext.Provider >
      </CategoriesUpdateContext.Provider >
      </CategoriesCallbackContext.Provider >
      </CategoriesContext.Provider>
    </>
  )
}

export default App;
