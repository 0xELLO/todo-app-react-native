import {AxiosError} from 'axios';
import {IJwtResponse} from '../domain/IJwtResponse';
import {CredentialType, UserCredentials} from '../hooks/UserCredentials';
import httpClient from './HttpClient';

export class IdentityService {
  private useUserCredentials = new UserCredentials();
  async refreshToken(): Promise<any> {
    try {
      let response = await httpClient.post('/Account/RefreshToken', {
        jwt: this.useUserCredentials.get(CredentialType.Token),
        refreshToken: this.useUserCredentials.get(CredentialType.RefreshToken),
      });

      let resData = response.data as IJwtResponse;

      this.useUserCredentials.set(CredentialType.Token, resData.token);
      this.useUserCredentials.set(CredentialType.RefreshToken, resData.refreshToken);

      return {
        status: response.status,
        data: response.data,
      };
    } catch (e) {
      let restApiError = (e as AxiosError).response?.data;
      let response = {
        status: (e as AxiosError).response!.status,
        restApiError,
      };
      return response;
    }
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<any> {
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

      this.useUserCredentials.set(CredentialType.Token, resData.token);
      this.useUserCredentials.set(CredentialType.RefreshToken, resData.refreshToken);

      return {
        status: response.status,
        data: resData,
      };
    } catch (e) {
      console.log('error: ' + e);
      let restApiError = (e as AxiosError).response?.data;
      console.log('error: ' + restApiError);
      let response = {
        status: (e as AxiosError).response!.status,
        restApiError,
      };
      return response;
    }
  }

  async login(email: string, password: string): Promise<any> {
    let loginInfo = {
      email,
      password,
    };

    try {
      let response = await httpClient.post(
        '/Account/Login',
        loginInfo,
      );
      let resData = response.data as IJwtResponse;

      this.useUserCredentials.set(CredentialType.Token, resData.token);
      this.useUserCredentials.set(CredentialType.RefreshToken, resData.refreshToken);

      return {
        status: response.status,
        data: resData,
      };
    } catch (e) {
      let restApiError = (e as AxiosError).response?.data;
      let response = {
        status: (e as AxiosError).response!.status,
        restApiError,
      };
      return response;
    }
  }
}
