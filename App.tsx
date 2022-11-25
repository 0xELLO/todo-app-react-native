import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RegisterView from './src/screens/login/RegisterView';
import { useNavigationTheme } from './src/styles/theme';
import LoginView from './src/screens/login/LoginView';
import { CredentialType, UserCredentials } from './src/util/UserCredentials';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IdentityService } from './src/services/IdentityService';
import CategoriesView from './src/screens/categories/CategoriesView';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrioritiesView from './src/screens/priorities/PrioritiesView';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LogoutView from './src/screens/login/LogoutView';
import TasksView from './src/screens/Tasks/TasksView';
import { Platform, UIManager } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MainStackParamList } from './src/util/MainStackParamList';

export const LoginStateContext = React.createContext(false);
export const AuthStateUpdateContext = React.createContext((_value: boolean) => {});

if (Platform.OS === 'android') {
	UIManager.setLayoutAnimationEnabledExperimental &&
		UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
		};
		getInitialAuthState();
	}, []);

	return (
		<LoginStateContext.Provider value={authState}>
			<AuthStateUpdateContext.Provider value={setAuthState}>
				<GestureHandlerRootView style={{ flex: 1 }}>
				<SafeAreaProvider>
						<NavigationContainer theme={navTheme}>
									{authState === true ? <MainTabNavigation /> : <DefaultTabNavigation/>}
						</NavigationContainer>
					</SafeAreaProvider>
				</GestureHandlerRootView>
			</AuthStateUpdateContext.Provider>
		</LoginStateContext.Provider>
	);
};

const DefaultTabNavigation = () => {
	const Tab = createBottomTabNavigator();
	return (
		<Tab.Navigator screenOptions={{
			tabBarLabelPosition: 'beside-icon',
			tabBarLabelStyle: {
				fontWeight: '700',
				fontSize: 15,
			},
			tabBarIconStyle: { display: 'none' },
			headerShown: false,
		}}>
			<Tab.Screen name="Login" component={LoginView} />
			<Tab.Screen name="Register" component={RegisterView} />
		</Tab.Navigator>
	);
};

const MainTabNavigation = () => {
	const Tab = createBottomTabNavigator();
	return (
		<Tab.Navigator screenOptions={{
			tabBarLabelPosition: 'beside-icon',
			tabBarLabelStyle: {
				fontWeight: '700',
				fontSize: 15,
			},
			tabBarIconStyle: { display: 'none' },
			headerShown: false,
		}}>
				<Tab.Screen name="My Categories" component={CategoriesStack} />
				<Tab.Screen name="Logout" component={LogoutView} />
		</Tab.Navigator>
	);
};

const CategoriesStack = () => {
	const HomeStack = createNativeStackNavigator<MainStackParamList>();
	return (
		<HomeStack.Navigator>
				<HomeStack.Screen name="Categories" component={CategoriesView} />
				<HomeStack.Screen name="Priorities" component={PrioritiesView} />
				<HomeStack.Screen name="Tasks" component={TasksView} />
		</HomeStack.Navigator>
	);
};

export default App;
