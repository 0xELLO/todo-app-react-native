import {AxiosError} from 'axios';
import {IJwtResponse} from '../domain/IJwtResponse';
import {CredentialType, UserCredentials} from '../hooks/UserCredentials';
import httpClient from './HttpClient';

export class IdentityService {
  useUserCredentials = new UserCredentials();
  async refreshToken(): Promise<any> {
    try {
      let response = await httpClient.post('/identity/Account/refreshtoken', {
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
    try {
      let loginInfo = {
        email,
        password,
        firstName,
        lastName,
      };

      let response = await httpClient.post(
        '/identity/Account/Register',
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

  async login(email: string, password: string): Promise<any> {
    let loginInfo = {
      email,
      password,
    };

    try {
      let response = await httpClient.post(
        '/identity/Account/LogIn',
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
