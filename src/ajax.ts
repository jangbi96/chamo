import axios from 'axios'
export const ajax = axios.create({
    baseURL: 'https://admin.lightning.ai.kr/',
    timeout: 1000,
    headers: { 'Content-Type': 'application/json' },
})
