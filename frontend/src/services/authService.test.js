import { describe, test, expect, vi } from "vitest";
import axios from "axios";
import { register } from "./authService";

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

});