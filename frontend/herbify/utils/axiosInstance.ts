import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000';

const instance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
});

export default instance;

// Function to make a request with an AbortController signal
export const makeRequest = async (url: string, method: string = 'get', data?: any, signal?: AbortSignal) => {
    try {
        const response = await instance({
            method: method,
            url: url,
            data: data,
            ...(signal && { signal: signal }) // Conditionally add the signal
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled', error.message);
        } else {
            // Handle other errors
            throw error;
        }
    }
};
