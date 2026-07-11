import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import Login from "../pages/Login";
import * as authService from "../services/authService";

vi.mock("../services/authService");

describe("Login Page", () => {
    test("should render login form with email, password fields and login button", () => {
        render(<Login />);

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    test("should call login service when form is submitted", async () => {
        authService.login.mockResolvedValue({});

        render(<Login />);

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
});
