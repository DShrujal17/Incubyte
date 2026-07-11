import axios from "axios";

const BASE_URL = "http://localhost:8080/api/sales";

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getMySales = async () => {
    const response = await axios.get(`${BASE_URL}/my`, getAuthHeaders());
    return response.data;
};

export const getAllSales = async () => {
    const response = await axios.get(BASE_URL, getAuthHeaders());
    return response.data;
};
