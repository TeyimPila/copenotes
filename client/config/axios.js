import axios from "axios";

console.log('api', process.env.apiUrl)

const axiosInstance = axios.create({
  baseURL: process.env.apiUrl,
  timeout: 1000,
});

export default axiosInstance