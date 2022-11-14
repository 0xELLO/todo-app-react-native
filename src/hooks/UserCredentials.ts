import AsyncStorage from '@react-native-async-storage/async-storage';

export enum CredentialType {
  Token = '@token',
  RefreshToken = '@refreshToken',
  FirstName = '@firstName',
  LastName = '@lastName',
}

export class UserCredentials {
  async get(key: CredentialType) {
    return getSavedValue(key);
  }

  async set(key: CredentialType, value: string) {
    return setValue(key, value);
  }
}

async function getSavedValue(key: string) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.log(e);
  }
}

async function setValue(key: string, value: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }

  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
}
