import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/api/sales`;

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getMySales = async () => {
    const response = await axios.get(`${API_URL}/my`, getAuthHeaders());
    return response.data;
};

export const getAllSales = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};
