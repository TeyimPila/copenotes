import axios from "axios";

console.log('api', process.env.apiUrl)

export const ssInstance = axios.create({
  baseURL: process.env.ssUrl,
  timeout: 1000,
});

export const clientInstance = axios.create({
  baseURL: process.env.clientUrl,
  timeout: 1000,
});
