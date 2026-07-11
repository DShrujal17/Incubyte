import axios from "axios";

const API_URL = "http://localhost:8080/api/vehicles";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getAllVehicles = async () => {
    const response = await axios.get(API_URL, getHeaders());
    return response.data;
};

export const createVehicle = async (vehicleData) => {
    const response = await axios.post(API_URL, vehicleData, getHeaders());
    return response.data;
};

export const updateVehicle = async (id, vehicleData) => {
    const response = await axios.put(`${API_URL}/${id}`, vehicleData, getHeaders());
    return response.data;
};

export const deleteVehicle = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getHeaders());
    return response.data;
};
