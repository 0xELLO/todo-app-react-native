import {AxiosError} from 'axios';
import {IJwtResponse} from '../domain/IJwtResponse';
import {CredentialType, UserCredentials} from '../hooks/UserCredentials';
import httpClient from './HttpClient';

export class IdentityService {
  private useUserCredentials = new UserCredentials();
  async refreshToken(): Promise<boolean> {
    try {
      let refreshToken = {
        jwt: await this.useUserCredentials.get(CredentialType.Token),
        refreshToken: await this.useUserCredentials.get(CredentialType.RefreshToken)
      };
      console.log(refreshToken.jwt)
      console.log(refreshToken.refreshToken)
      let response = await httpClient.post('/Account/RefreshToken', refreshToken);

      let resData = response.data as IJwtResponse;

      await this.useUserCredentials.set(CredentialType.Token, resData.token);
      await this.useUserCredentials.set(CredentialType.RefreshToken, resData.refreshToken);

      return true;
    } catch (e) {
      console.log('error: ' + e);
      let restApiError = (e as AxiosError).response?.data;
      console.log('error: ' + restApiError);
      return false;
    }
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<boolean> {
    console.log('Starting register');
    try {
      let loginInfo = {
        email,
        password,
        firstName,
        lastName,
      };

      console.log('Resister info: ' + loginInfo.email, loginInfo.password, loginInfo.firstName, loginInfo.lastName);

      let response = await httpClient.post(
        '/Account/Register',
        loginInfo,
      );

      console.log('Status: ' + response.status);

      let resData = response.data as IJwtResponse;

      console.log('Data: ' + resData);

      await this.useUserCredentials.set(CredentialType.Token, resData.token);
      await this.useUserCredentials.set(CredentialType.RefreshToken, resData.refreshToken);

      return true;
    } catch (e) {
      console.log('error: ' + e);
      let restApiError = (e as AxiosError).response?.data;
      console.log('error: ' + restApiError);
      return false;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      let loginInfo = {email, password};
      let response = await httpClient.post('/Account/Login', loginInfo);
      let resData = response.data as IJwtResponse;

      this.useUserCredentials.set(CredentialType.Token, resData.token);
      this.useUserCredentials.set(CredentialType.RefreshToken, resData.refreshToken);
      console.log(await this.useUserCredentials.get(CredentialType.Token))
      return true;
    } catch (e) {
      console.log('error: ' + e);
      let restApiError = (e as AxiosError).response?.data;
      console.log('error: ' + restApiError);
      return false;
    }
  }
}
