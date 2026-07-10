import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import Register from "../pages/Register";
import * as authService from "../services/authService";

vi.mock("../services/authService");

describe("Register Page", () => {

    test("should call register service when form is submitted", async () => {

        authService.register.mockResolvedValue({});

        render(<Register />);

        await userEvent.type(
            screen.getByLabelText(/name/i),
            "Shrujal"
        );

        await userEvent.type(
            screen.getByLabelText(/email/i),
            "shrujal@gmail.com"
        );

        await userEvent.type(
            screen.getByLabelText(/password/i),
            "password123"
        );

        await userEvent.click(
            screen.getByRole("button", {
                name: /register/i,
            })
        );

        expect(authService.register).toHaveBeenCalledWith({
            name: "Shrujal",
            email: "shrujal@gmail.com",
            password: "password123",
        });

    });

});