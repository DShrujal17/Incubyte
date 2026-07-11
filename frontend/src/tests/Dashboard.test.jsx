import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import * as vehicleService from "../services/vehicleService";

vi.mock("../services/vehicleService");

describe("Dashboard Page", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    test("should fetch and render vehicles list on load", async () => {
        const mockVehicles = [
            {
                id: 1,
                vin: "VIN12345678901234",
                make: "Toyota",
                model: "Camry",
                year: 2024,
                price: 35000,
                status: "AVAILABLE",
            },
        ];

        vehicleService.getAllVehicles.mockResolvedValue(mockVehicles);

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(vehicleService.getAllVehicles).toHaveBeenCalled();

        await waitFor(() => {
            expect(screen.getByText("Toyota")).toBeInTheDocument();
            expect(screen.getByText("Camry")).toBeInTheDocument();
            expect(screen.getByText("VIN12345678901234")).toBeInTheDocument();
            expect(screen.getByText("35000")).toBeInTheDocument();
        });
    });
});
