import { render, screen } from "@testing-library/react";
import Register from "../pages/Register";

describe("Register Page", () => {

    test("should render registration form", () => {

        render(<Register />);

        expect(
            screen.getByRole("heading", {
                name: /register/i,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText(/name/i)
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText(/email/i)
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText(/password/i)
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /register/i,
            })
        ).toBeInTheDocument();

    });

});