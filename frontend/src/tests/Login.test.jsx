import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import Login from "../pages/Login";
import * as authService from "../services/authService";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../services/authService");

const renderLogin = () => render(
    <MemoryRouter>
        <Login />
    </MemoryRouter>
);

describe("Login Page", () => {
    test("should render login form with email, password fields and login button", () => {
        renderLogin();

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    test("should call login service when form is submitted", async () => {
        authService.login.mockResolvedValue({});

        renderLogin();

        await userEvent.type(
            screen.getByLabelText(/email/i),
            "shrujal@gmail.com"
        );

        await userEvent.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        await userEvent.click(
            screen.getByRole("button", { name: /login/i })
        );

        expect(authService.login).toHaveBeenCalledWith({
            email: "shrujal@gmail.com",
            password: "password123",
        });
    });

    test("should store JWT in localStorage on successful login", async () => {
        const spySetItem = vi.spyOn(Storage.prototype, "setItem");
        authService.login.mockResolvedValue({
            message: "Login successful",
            token: "dummy-jwt-token",
        });

        renderLogin();

        await userEvent.type(
            screen.getByLabelText(/email/i),
            "shrujal@gmail.com"
        );

        await userEvent.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        await userEvent.click(
            screen.getByRole("button", { name: /login/i })
        );

        expect(spySetItem).toHaveBeenCalledWith("token", "dummy-jwt-token");

        spySetItem.mockRestore();
    });

    test("should redirect to dashboard on successful login", async () => {
        authService.login.mockResolvedValue({
            message: "Login successful",
            token: "dummy-jwt-token",
        });

        renderLogin();

        await userEvent.type(
            screen.getByLabelText(/email/i),
            "shrujal@gmail.com"
        );

        await userEvent.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        await userEvent.click(
            screen.getByRole("button", { name: /login/i })
        );

        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    test("should display error message on login failure", async () => {
        authService.login.mockRejectedValue(new Error("Invalid email or password"));

        renderLogin();

        await userEvent.type(
            screen.getByLabelText(/email/i),
            "wrong@gmail.com"
        );

        await userEvent.type(
            screen.getByLabelText(/password/i),
            "wrongpass"
        );

        await userEvent.click(
            screen.getByRole("button", { name: /login/i })
        );

        expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
    });
});
