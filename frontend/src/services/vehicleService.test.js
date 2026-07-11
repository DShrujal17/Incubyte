import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import axios from "axios";
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle, searchVehicles, purchaseVehicle, restockVehicle } from "./vehicleService";

vi.mock("axios");

describe("Vehicle Service", () => {
    beforeEach(() => {
        vi.spyOn(Storage.prototype, "getItem").mockReturnValue("dummy-jwt-token");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("should fetch all vehicles with Authorization header", async () => {
        const mockVehicles = [{ id: 1, make: "Toyota", model: "Camry" }];
        axios.get.mockResolvedValue({ data: mockVehicles });

        const result = await getAllVehicles();

        expect(axios.get).toHaveBeenCalledWith(
            "http://localhost:8080/api/vehicles",
            {
                headers: {
                    Authorization: "Bearer dummy-jwt-token",
                },
            }
        );
        expect(result).toEqual(mockVehicles);
    });

    test("should create vehicle with Authorization header", async () => {
        const vehicleData = { make: "Toyota", category: "Sedan", quantity: 5 };
        axios.post.mockResolvedValue({ data: { id: 1, ...vehicleData } });

        const result = await createVehicle(vehicleData);

        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost:8080/api/vehicles",
            vehicleData,
            {
                headers: {
                    Authorization: "Bearer dummy-jwt-token",
                },
            }
        );
        expect(result).toEqual({ id: 1, ...vehicleData });
    });

    test("should update vehicle with Authorization header", async () => {
        const vehicleData = { make: "Toyota Updated", category: "Sedan", quantity: 10 };
        axios.put.mockResolvedValue({ data: { id: 1, ...vehicleData } });

        const result = await updateVehicle(1, vehicleData);

        expect(axios.put).toHaveBeenCalledWith(
            "http://localhost:8080/api/vehicles/1",
            vehicleData,
            {
                headers: {
                    Authorization: "Bearer dummy-jwt-token",
                },
            }
        );
        expect(result).toEqual({ id: 1, ...vehicleData });
    });

    test("should search vehicles with parameters and Authorization header", async () => {
        const filters = { make: "Toyota", minPrice: 20000 };
        axios.get.mockResolvedValue({ data: [{ id: 1, make: "Toyota" }] });

        const result = await searchVehicles(filters);

        expect(axios.get).toHaveBeenCalledWith(
            "http://localhost:8080/api/vehicles/search",
            {
                headers: {
                    Authorization: "Bearer dummy-jwt-token",
                },
                params: expect.any(URLSearchParams),
            }
        );
        expect(result).toEqual([{ id: 1, make: "Toyota" }]);
    });

    test("should delete vehicle with Authorization header", async () => {
        axios.delete.mockResolvedValue({});

        await deleteVehicle(1);

        expect(axios.delete).toHaveBeenCalledWith(
            "http://localhost:8080/api/vehicles/1",
            {
                headers: {
                    Authorization: "Bearer dummy-jwt-token",
                },
            }
        );
    });

    test("should purchase vehicle with Authorization header", async () => {
        axios.post.mockResolvedValue({ data: { id: 1, quantity: 4 } });

        const result = await purchaseVehicle(1);

        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost:8080/api/vehicles/1/purchase",
            null,
            {
                headers: {
                    Authorization: "Bearer dummy-jwt-token",
                },
            }
        );
        expect(result).toEqual({ id: 1, quantity: 4 });
    });

    test("should restock vehicle with Authorization header", async () => {
        axios.post.mockResolvedValue({ data: { id: 1, quantity: 15 } });

        const result = await restockVehicle(1, 10);

        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost:8080/api/vehicles/1/restock",
            { quantity: 10 },
            {
                headers: {
                    Authorization: "Bearer dummy-jwt-token",
                },
            }
        );
        expect(result).toEqual({ id: 1, quantity: 15 });
    });
});
