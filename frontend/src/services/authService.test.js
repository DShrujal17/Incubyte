import { describe, test, expect, vi } from "vitest";
import axios from "axios";
import { register, login } from "./authService";

vi.mock("axios");

describe("Auth Service", () => {

    test("should call backend register API", async () => {

        axios.post.mockResolvedValue({
            data: {
                name: "Shrujal",
                email: "shrujal@gmail.com",
            },
        });

        const user = {
            name: "Shrujal",
            email: "shrujal@gmail.com",
            password: "password123",
        };

        await register(user);

        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost:8080/api/auth/register",
            user
        );

    });

    test("should call backend login API", async () => {

        axios.post.mockResolvedValue({
            data: {
                message: "Login successful",
                token: "dummy-jwt-token",
            },
        });

        const credentials = {
            email: "shrujal@gmail.com",
            password: "password123",
        };

        const result = await login(credentials);

        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost:8080/api/auth/login",
            credentials
        );

        expect(result).toEqual({
            message: "Login successful",
            token: "dummy-jwt-token",
        });

    });

});