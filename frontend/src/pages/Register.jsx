import { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../services/authService";

export default function Register() {

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
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
        setError("");
        setSuccess(false);
        try {
            await register(formData);
            setSuccess(true);
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        }

    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Register</h1>
                <p className="auth-subtitle">Create an account to join the Car Dealership</p>

                {error && <div className="auth-error">{error}</div>}
                {success && <div style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "12px", borderRadius: "8px", fontSize: "14px", textAlign: "center", marginBottom: "16px" }}>Registration successful! <Link to="/login">Sign in here</Link></div>}

                <form onSubmit={handleSubmit} className="auth-form">

                    <div className="form-group">
                        <label htmlFor="name">Name</label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button">
                        Register
                    </button>

                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>

            </div>
        </div>
    );

}