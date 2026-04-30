import axios from 'axios';

const client = axios.create({ baseURL: '/api' });

export async function optimizeRoutes(cities) {
  const { data } = await client.post('/optimize', { cities });
  return data;
}
