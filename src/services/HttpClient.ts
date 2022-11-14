import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'https://taltech.akaver.com/api/v1',
  headers: {
    'Content-type': 'application/json',
  },
});

export default httpClient;
