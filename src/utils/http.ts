// Tạo instance axios để call api

import axios, { AxiosInstance } from 'axios'

class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:4000/',
      timeout: 10000, // sau 10s thì hủy
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

const http = new Http()
export default http
