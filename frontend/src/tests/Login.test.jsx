import { render, screen } from "@testing-library/react";
import Login from "../pages/Login";

describe("Login Page", () => {
    test("should render login form with email, password fields and login button", () => {
        render(<Login />);

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });
});
