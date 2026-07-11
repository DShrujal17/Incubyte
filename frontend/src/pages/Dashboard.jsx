import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle } from "../services/vehicleService";

export default function Dashboard() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [editingVehicleId, setEditingVehicleId] = useState(null);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState("");

    const [formData, setFormData] = useState({
        vin: "",
        make: "",
        model: "",
        year: "",
        price: "",
        status: "AVAILABLE",
    });

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const data = await getAllVehicles();
            setVehicles(data || []);
        } catch (err) {
            console.error("Failed to load inventory:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        setUserRole(localStorage.getItem("role") || "USER");
        fetchVehicles();
    }, [navigate]);

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleOpenAddModal = () => {
        setModalMode("add");
        setFormData({
            vin: "",
            make: "",
            model: "",
            year: "",
            price: "",
            status: "AVAILABLE",
        });
        setError("");
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (vehicle) => {
        setModalMode("edit");
        setEditingVehicleId(vehicle.id);
        setFormData({
            vin: vehicle.vin,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year.toString(),
            price: vehicle.price.toString(),
            status: vehicle.status,
        });
        setError("");
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const payload = {
            vin: formData.vin,
            make: formData.make,
            model: formData.model,
            year: parseInt(formData.year, 10),
            price: parseFloat(formData.price),
            status: formData.status,
        };

        try {
            if (modalMode === "add") {
                await createVehicle(payload);
            } else {
                await updateVehicle(editingVehicleId, payload);
            }
            setIsModalOpen(false);
            fetchVehicles();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "An error occurred");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            try {
                await deleteVehicle(id);
                fetchVehicles();
            } catch (err) {
                console.error("Failed to delete vehicle:", err);
            }
        }
    };

    return (
        <div className="dashboard-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ margin: 0 }}>Dashboard</h1>
                {userRole === "ADMIN" && (
                    <button className="auth-button" style={{ width: "auto", padding: "10px 20px" }} onClick={handleOpenAddModal}>Add Vehicle</button>
                )}
            </div>

            {loading ? (
                <p>Loading inventory...</p>
            ) : vehicles.length === 0 ? (
                <p>No vehicles in inventory.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                    <thead>
                        <tr style={{ background: "var(--code-bg)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                            <th style={{ padding: "12px 16px" }}>VIN</th>
                            <th style={{ padding: "12px 16px" }}>Make</th>
                            <th style={{ padding: "12px 16px" }}>Model</th>
                            <th style={{ padding: "12px 16px" }}>Year</th>
                            <th style={{ padding: "12px 16px" }}>Price</th>
                            <th style={{ padding: "12px 16px" }}>Status</th>
                            {userRole === "ADMIN" && <th style={{ padding: "12px 16px" }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((v) => (
                            <tr key={v.id} style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                                <td style={{ padding: "12px 16px" }}>{v.vin}</td>
                                <td style={{ padding: "12px 16px" }}>{v.make}</td>
                                <td style={{ padding: "12px 16px" }}>{v.model}</td>
                                <td style={{ padding: "12px 16px" }}>{v.year}</td>
                                <td style={{ padding: "12px 16px" }}>{v.price}</td>
                                <td style={{ padding: "12px 16px" }}>{v.status}</td>
                                {userRole === "ADMIN" && (
                                    <td style={{ padding: "12px 16px" }}>
                                        <button className="auth-button" style={{ width: "auto", padding: "6px 12px", marginRight: "8px", background: "var(--accent)" }} onClick={() => handleOpenEditModal(v)}>Edit</button>
                                        <button className="auth-button btn-danger" style={{ width: "auto", padding: "6px 12px" }} onClick={() => handleDelete(v.id)}>Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-header">
                            <h2>{modalMode === "add" ? "Add Vehicle" : "Edit Vehicle"}</h2>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        {error && <div className="auth-error">{error}</div>}
                        <form onSubmit={handleFormSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="vin">VIN</label>
                                <input
                                    id="vin"
                                    name="vin"
                                    type="text"
                                    value={formData.vin}
                                    onChange={handleInputChange}
                                    maxLength={17}
                                    required
                                    disabled={modalMode === "edit"}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="make">Make</label>
                                <input
                                    id="make"
                                    name="make"
                                    type="text"
                                    value={formData.make}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="model">Model</label>
                                <input
                                    id="model"
                                    name="model"
                                    type="text"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="year">Year</label>
                                <input
                                    id="year"
                                    name="year"
                                    type="number"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    min={1886}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    min={0.01}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    style={{ font: "inherit", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }}
                                >
                                    <option value="AVAILABLE">AVAILABLE</option>
                                    <option value="SOLD">SOLD</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="auth-button btn-secondary" style={{ width: "auto", padding: "10px 20px" }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="auth-button" style={{ width: "auto", padding: "10px 20px" }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
