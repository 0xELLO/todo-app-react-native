import AsyncStorage from '@react-native-async-storage/async-storage';

export enum CredentialType {
  Token = '@token',
  RefreshToken = '@refreshToken',
  FirstName = '@firstName',
  LastName = '@lastName',
}

export class UserCredentials {
  async get(key: CredentialType) {
    return await getSavedValue(key);
  }

  async set(key: CredentialType, value: string) {
    return await setValue(key, value);
  }

  async deleteAll() {
    await AsyncStorage.removeItem(CredentialType.FirstName);
    await AsyncStorage.removeItem(CredentialType.LastName);
    await AsyncStorage.removeItem(CredentialType.RefreshToken);
    await AsyncStorage.removeItem(CredentialType.Token);
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
