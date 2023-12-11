import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000';

const instance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
});

export default instance;