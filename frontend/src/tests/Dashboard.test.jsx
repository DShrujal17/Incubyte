import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

    test("should open modal, fill form, and create vehicle successfully", async () => {
        vehicleService.getAllVehicles.mockResolvedValue([]);
        vehicleService.createVehicle.mockResolvedValue({
            id: 2,
            vin: "VIN12345678901234",
            make: "Honda",
            model: "Civic",
            year: 2024,
            price: 28000,
            status: "AVAILABLE",
        });

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        const addButton = screen.getByRole("button", { name: /add vehicle/i });
        await userEvent.click(addButton);

        await userEvent.type(screen.getByLabelText(/vin/i), "VIN12345678901234");
        await userEvent.type(screen.getByLabelText(/make/i), "Honda");
        await userEvent.type(screen.getByLabelText(/model/i), "Civic");
        await userEvent.type(screen.getByLabelText(/year/i), "2024");
        await userEvent.type(screen.getByLabelText(/price/i), "28000");

        const submitButton = screen.getByRole("button", { name: /save/i });
        await userEvent.click(submitButton);

        expect(vehicleService.createVehicle).toHaveBeenCalledWith({
            vin: "VIN12345678901234",
            make: "Honda",
            model: "Civic",
            year: 2024,
            price: 28000,
            status: "AVAILABLE",
        });
    });
});
