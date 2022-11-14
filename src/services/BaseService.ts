import {AxiosError} from 'axios';
import { CredentialType, UserCredentials } from '../hooks/UserCredentials';
import httpClient from './HttpClient';
import { IdentityService } from './IdentityService';

export class BaseService<TEntity> {
  useUserCredentials = new UserCredentials();
  constructor(protected path: string) {}

  async getAll(action: string): Promise<TEntity[] | null> {
    try {
      console.log(`Get All at ${action}`);
      let jwt = this.useUserCredentials.get(CredentialType.Token);
      let response = await httpClient.get(this.path + '/' + action, {
        headers: {
          Authorization: 'bearer ' + jwt,
        }
      });
      console.log(response.data);
      return response.data as TEntity[];
    } catch (e) {
      console.log(e as AxiosError);
      console.log('error');
      return null;
    }
  }

  async add(action: string, entity: TEntity): Promise<TEntity | null> {
    try {
      console.log(`Add at ${action}`);
      let jwt = this.useUserCredentials.get(CredentialType.Token);
      console.log(jwt);
      let response = await httpClient.post(this.path + '/' + action, entity, {
        headers: {
          Authorization: 'bearer ' + jwt,
        }
      });
      return response.data as TEntity;
    } catch (e) {
      console.log(e as AxiosError);
      console.log('error');
      return null;
    }
  }

  async getAllById(action: string, id: string): Promise<TEntity[] | null> {
    try {
      console.log(`Get all by id at ${action}`);;
      let jwt = this.useUserCredentials.get(CredentialType.Token);;
      let response = await httpClient.get(this.path + '/' + action + '/' + id, {
        headers: {
          Authorization: 'bearer ' + jwt,
        },
      });
      console.log(response.data);;
      return response.data as TEntity[];
    } catch (e) {
      console.log(e as AxiosError);
      console.log('error');
      return null;
    }
  }

  async getById(action: string, id: string): Promise<TEntity | null> {
    try {
      console.log(`Get all by id at ${action}`);
      let jwt = this.useUserCredentials.get(CredentialType.Token);;
      let response = await httpClient.get(this.path + '/' + action + '/' + id, {
        headers: {
          Authorization: 'bearer ' + jwt,
        },
      });
      console.log(response.data);
      return response.data as TEntity;
    } catch (e) {
      if (await this.handleError(e as AxiosError)) {
        return await this.getById(action, id);
      }
      console.log(e as AxiosError);
      console.log('error');
      return null;
    }
  }

  // true try again, false not
  async handleError(error: AxiosError): Promise<boolean> {
    if (error.response?.status === 401) {
      const identityService = new IdentityService();
      await identityService.refreshToken();
      return true;
    }
    return false;
  }
}
