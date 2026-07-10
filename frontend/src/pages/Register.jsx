import { useState } from "react";
import { register } from "../services/authService";

export default function Register() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        await register(formData);

    };

    return (
        <div>

            <h1>Register</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name">Name</label>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">
                    Register
                </button>

            </form>

        </div>
    );

}