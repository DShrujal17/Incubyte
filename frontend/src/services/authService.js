import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const register = async (userData) => {
    const response = await axios.post(
        `${BASE_URL}/api/auth/register`,
        userData
    );
    return response.data;
};

export const login = async (credentials) => {
    const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        credentials
    );
    return response.data;
};