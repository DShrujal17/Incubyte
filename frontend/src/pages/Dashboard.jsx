import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle, searchVehicles } from "../services/vehicleService";

export default function Dashboard() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [editingVehicleId, setEditingVehicleId] = useState(null);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vehicleToDeleteId, setVehicleToDeleteId] = useState(null);

    const [formData, setFormData] = useState({
        make: "",
        model: "",
        year: "",
        price: "",
        status: "AVAILABLE",
        category: "",
        quantity: "",
    });

    const [filters, setFilters] = useState({
        make: "",
        model: "",
        category: "",
        minPrice: "",
        maxPrice: "",
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

    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value,
        });
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const data = await searchVehicles(filters);
            setVehicles(data || []);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        const resetFilters = {
            make: "",
            model: "",
            category: "",
            minPrice: "",
            maxPrice: "",
        };
        setFilters(resetFilters);
        fetchVehicles();
    };

    const handleOpenAddModal = () => {
        setModalMode("add");
        setFormData({
            make: "",
            model: "",
            year: "",
            price: "",
            status: "AVAILABLE",
            category: "",
            quantity: "",
        });
        setError("");
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (vehicle) => {
        setModalMode("edit");
        setEditingVehicleId(vehicle.id);
        setFormData({
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year.toString(),
            price: vehicle.price.toString(),
            status: vehicle.status,
            category: vehicle.category || "",
            quantity: vehicle.quantity != null ? vehicle.quantity.toString() : "",
        });
        setError("");
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const payload = {
            make: formData.make,
            model: formData.model,
            year: parseInt(formData.year, 10),
            price: parseFloat(formData.price),
            status: formData.status,
            category: formData.category,
            quantity: parseInt(formData.quantity, 10),
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

    const handleDelete = (id) => {
        setVehicleToDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteVehicle(vehicleToDeleteId);
            setIsDeleteModalOpen(false);
            fetchVehicles();
        } catch (err) {
            console.error("Failed to delete vehicle:", err);
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

            {/* Search Filters Bar */}
            <div style={{
                background: "var(--code-bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "12px",
                alignItems: "end"
            }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="search-make" style={{ fontSize: "12px", marginBottom: "4px" }}>Filter Make</label>
                    <input
                        id="search-make"
                        name="make"
                        type="text"
                        value={filters.make}
                        onChange={handleFilterChange}
                        placeholder="Search Make..."
                        style={{ padding: "8px 12px" }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="search-model" style={{ fontSize: "12px", marginBottom: "4px" }}>Filter Model</label>
                    <input
                        id="search-model"
                        name="model"
                        type="text"
                        value={filters.model}
                        onChange={handleFilterChange}
                        placeholder="Search Model..."
                        style={{ padding: "8px 12px" }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="search-category" style={{ fontSize: "12px", marginBottom: "4px" }}>Filter Category</label>
                    <input
                        id="search-category"
                        name="category"
                        type="text"
                        value={filters.category}
                        onChange={handleFilterChange}
                        placeholder="Search Category..."
                        style={{ padding: "8px 12px" }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="search-minPrice" style={{ fontSize: "12px", marginBottom: "4px" }}>Min Price</label>
                    <input
                        id="search-minPrice"
                        name="minPrice"
                        type="number"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        placeholder="Min Price..."
                        style={{ padding: "8px 12px" }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="search-maxPrice" style={{ fontSize: "12px", marginBottom: "4px" }}>Max Price</label>
                    <input
                        id="search-maxPrice"
                        name="maxPrice"
                        type="number"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        placeholder="Max Price..."
                        style={{ padding: "8px 12px" }}
                    />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button className="auth-button" style={{ width: "100%", padding: "10px" }} onClick={handleSearch}>Search</button>
                    <button className="auth-button btn-secondary" style={{ width: "auto", padding: "10px" }} onClick={handleClearFilters}>Reset</button>
                </div>
            </div>

            {loading ? (
                <p>Loading inventory...</p>
            ) : vehicles.length === 0 ? (
                <p>No vehicles in inventory.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                    <thead>
                        <tr style={{ background: "var(--code-bg)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                            <th style={{ padding: "12px 16px" }}>Make</th>
                            <th style={{ padding: "12px 16px" }}>Model</th>
                            <th style={{ padding: "12px 16px" }}>Year</th>
                            <th style={{ padding: "12px 16px" }}>Price</th>
                            <th style={{ padding: "12px 16px" }}>Category</th>
                            <th style={{ padding: "12px 16px" }}>Quantity</th>
                            <th style={{ padding: "12px 16px" }}>Status</th>
                            {userRole === "ADMIN" && <th style={{ padding: "12px 16px" }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((v) => (
                            <tr key={v.id} style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                                <td style={{ padding: "12px 16px" }}>{v.make}</td>
                                <td style={{ padding: "12px 16px" }}>{v.model}</td>
                                <td style={{ padding: "12px 16px" }}>{v.year}</td>
                                <td style={{ padding: "12px 16px" }}>{v.price}</td>
                                <td style={{ padding: "12px 16px" }}>{v.category}</td>
                                <td style={{ padding: "12px 16px" }}>{v.quantity}</td>
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
                                <label htmlFor="category">Category</label>
                                <input
                                    id="category"
                                    name="category"
                                    type="text"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="quantity">Quantity</label>
                                <input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    min={0}
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
            {isDeleteModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-card" style={{ maxWidth: "400px" }}>
                        <div className="modal-header">
                            <h2>Confirm Delete</h2>
                            <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>&times;</button>
                        </div>
                        <p style={{ margin: "0 0 24px 0", color: "var(--text)" }}>Are you sure you want to delete this vehicle?</p>
                        <div className="modal-actions">
                            <button className="auth-button btn-secondary" style={{ width: "auto", padding: "10px 20px" }} onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                            <button className="auth-button btn-danger" style={{ width: "auto", padding: "10px 20px" }} onClick={handleConfirmDelete}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
