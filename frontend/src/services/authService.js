import axios from "axios";

export const register = async (userData) => {

    const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        userData
    );

    return response.data;
};

export const login = async (credentials) => {
    const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        credentials
    );
    return response.data;
};