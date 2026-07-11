import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import * as vehicleService from "../services/vehicleService";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../services/vehicleService");

describe("Dashboard Page", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.clearAllMocks();
        mockNavigate.mockClear();
        vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
            if (key === "token") return "valid-token";
            if (key === "role") return "ADMIN";
            return null;
        });
    });

    test("should fetch and render vehicles list on load", async () => {
        const mockVehicles = [
            {
                id: 1,
                make: "Toyota",
                model: "Camry",
                year: 2024,
                price: 35000,
                status: "AVAILABLE",
                category: "Sedan",
                quantity: 5,
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
            expect(screen.getByText("35000")).toBeInTheDocument();
            expect(screen.getByText("Sedan")).toBeInTheDocument();
            expect(screen.getByText("5")).toBeInTheDocument();
        });
    });

    test("should open modal, fill form, and create vehicle successfully", async () => {
        vehicleService.getAllVehicles.mockResolvedValue([]);
        vehicleService.createVehicle.mockResolvedValue({
            id: 2,
            make: "Honda",
            model: "Civic",
            year: 2024,
            price: 28000,
            status: "AVAILABLE",
            category: "Sedan",
            quantity: 5,
        });

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        const addButton = screen.getByRole("button", { name: /add vehicle/i });
        await userEvent.click(addButton);

        await userEvent.type(screen.getByLabelText(/make/i), "Honda");
        await userEvent.type(screen.getByLabelText(/model/i), "Civic");
        await userEvent.type(screen.getByLabelText(/year/i), "2024");
        await userEvent.type(screen.getByLabelText(/price/i), "28000");
        await userEvent.type(screen.getByLabelText(/category/i), "Sedan");
        await userEvent.type(screen.getByLabelText(/quantity/i), "5");

        const submitButton = screen.getByRole("button", { name: /save/i });
        await userEvent.click(submitButton);

        expect(vehicleService.createVehicle).toHaveBeenCalledWith({
            make: "Honda",
            model: "Civic",
            year: 2024,
            price: 28000,
            status: "AVAILABLE",
            category: "Sedan",
            quantity: 5,
        });
    });

    test("should open modal prefilled on edit click, and save updates successfully", async () => {
        const mockVehicles = [
            {
                id: 1,
                make: "Toyota",
                model: "Camry",
                year: 2024,
                price: 35000,
                status: "AVAILABLE",
                category: "Sedan",
                quantity: 5,
            },
        ];

        vehicleService.getAllVehicles.mockResolvedValue(mockVehicles);
        vehicleService.updateVehicle.mockResolvedValue({
            id: 1,
            make: "Toyota Updated",
            model: "Camry Updated",
            year: 2025,
            price: 38000,
            status: "SOLD",
            category: "SUV",
            quantity: 10,
        });

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await screen.findByText("Toyota");

        const editButton = screen.getByRole("button", { name: /edit/i });
        await userEvent.click(editButton);

        const makeInput = screen.getByLabelText(/make/i);
        expect(makeInput).toHaveValue("Toyota");

        await userEvent.clear(makeInput);
        await userEvent.type(makeInput, "Toyota Updated");

        const modelInput = screen.getByLabelText(/model/i);
        await userEvent.clear(modelInput);
        await userEvent.type(modelInput, "Camry Updated");

        const yearInput = screen.getByLabelText(/year/i);
        await userEvent.clear(yearInput);
        await userEvent.type(yearInput, "2025");

        const priceInput = screen.getByLabelText(/price/i);
        await userEvent.clear(priceInput);
        await userEvent.type(priceInput, "38000");

        const statusSelect = screen.getByLabelText(/status/i);
        await userEvent.selectOptions(statusSelect, "SOLD");

        const categoryInput = screen.getByLabelText(/category/i);
        expect(categoryInput).toHaveValue("Sedan");
        await userEvent.clear(categoryInput);
        await userEvent.type(categoryInput, "SUV");

        const quantityInput = screen.getByLabelText(/quantity/i);
        expect(quantityInput).toHaveValue(5);
        await userEvent.clear(quantityInput);
        await userEvent.type(quantityInput, "10");

        const submitButton = screen.getByRole("button", { name: /save/i });
        await userEvent.click(submitButton);

        expect(vehicleService.updateVehicle).toHaveBeenCalledWith(1, {
            make: "Toyota Updated",
            model: "Camry Updated",
            year: 2025,
            price: 38000,
            status: "SOLD",
            category: "SUV",
            quantity: 10,
        });
    });

    test("should open custom confirm modal on delete click, and delete successfully", async () => {
        const mockVehicles = [
            {
                id: 1,
                make: "Toyota",
                model: "Camry",
                year: 2024,
                price: 35000,
                status: "AVAILABLE",
                category: "Sedan",
                quantity: 5,
            },
        ];

        vehicleService.getAllVehicles.mockResolvedValue(mockVehicles);
        vehicleService.deleteVehicle.mockResolvedValue({});

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await screen.findByText("Toyota");

        const deleteBtn = screen.getByRole("button", { name: /delete/i });
        await userEvent.click(deleteBtn);

        expect(screen.getByText("Are you sure you want to delete this vehicle?")).toBeInTheDocument();

        const confirmBtn = screen.getByRole("button", { name: /yes, delete/i });
        await userEvent.click(confirmBtn);

        expect(vehicleService.deleteVehicle).toHaveBeenCalledWith(1);
    });

    test("should redirect to login if token is missing", async () => {
        vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith("/login");
        expect(vehicleService.getAllVehicles).not.toHaveBeenCalled();
    });

    test("should hide Add, Edit and Delete controls if user role is USER", async () => {
        vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
            if (key === "token") return "valid-token";
            if (key === "role") return "USER";
            return null;
        });

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

        await screen.findByText("Toyota");

        expect(screen.queryByRole("button", { name: /add vehicle/i })).not.toBeInTheDocument();
        expect(screen.queryByText("Actions")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
    });
});
