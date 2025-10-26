import axios from "axios";
export const ajax = axios.create({
    baseURL: 'http://admin.lightning.ai.kr/',
    timeout: 1000,
    headers: {'Content-Type': 'application/json'}
  });
