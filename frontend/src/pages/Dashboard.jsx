import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle, searchVehicles, purchaseVehicle, restockVehicle } from "../services/vehicleService";
import { getMySales, getAllSales } from "../services/saleService";

const EMPTY_FORM = { make: "", model: "", year: "", price: "", status: "AVAILABLE", category: "", quantity: "" };
const EMPTY_FILTERS = { make: "", model: "", category: "", minPrice: "", maxPrice: "" };

const makeChangeHandler = (setter) => (event) =>
    setter((prev) => ({ ...prev, [event.target.name]: event.target.value }));

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
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [vehicleToRestockId, setVehicleToRestockId] = useState(null);
    const [restockQty, setRestockQty] = useState(1);
    const [actionMessage, setActionMessage] = useState("");
    const [activeTab, setActiveTab] = useState("inventory"); // "inventory" | "purchases"
    const [sales, setSales] = useState([]);
    const [salesLoading, setSalesLoading] = useState(false);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [activeFilterType, setActiveFilterType] = useState("make"); // "make" | "model" | "category" | "price" | "all"

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

    const handleInputChange = makeChangeHandler(setFormData);
    const handleFilterChange = makeChangeHandler(setFilters);

    const fetchSales = async (role) => {
        try {
            setSalesLoading(true);
            const data = role === "ADMIN" ? await getAllSales() : await getMySales();
            setSales(data || []);
        } catch (err) {
            console.error("Failed to load sales:", err);
        } finally {
            setSalesLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "purchases") fetchSales(userRole);
        else fetchVehicles();
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
        setFilters(EMPTY_FILTERS);
        setActiveFilterType("make");
        fetchVehicles();
    };

    const handleOpenAddModal = () => {
        setModalMode("add");
        setFormData(EMPTY_FORM);
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

    const showToast = (msg) => {
        setActionMessage(msg);
        setTimeout(() => setActionMessage(""), 3000);
    };

    const handlePurchase = async (id) => {
        try {
            await purchaseVehicle(id);
            fetchVehicles();
            showToast("Purchase successful! Vehicle quantity updated.");
        } catch (err) {
            showToast(err.response?.data?.message || "Purchase failed — vehicle may be out of stock.");
        }
    };

    const handleOpenRestockModal = (id) => {
        setVehicleToRestockId(id);
        setRestockQty(1);
        setIsRestockModalOpen(true);
    };

    const handleConfirmRestock = async () => {
        try {
            await restockVehicle(vehicleToRestockId, restockQty);
            setIsRestockModalOpen(false);
            fetchVehicles();
            showToast(`Restocked successfully with ${restockQty} unit(s).`);
        } catch (err) {
            console.error("Failed to restock vehicle:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 style={{ margin: 0 }}>Dashboard</h1>
                <div className="dashboard-header-actions">
                    <span style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "600",
                        background: userRole === "ADMIN" ? "rgba(99,102,241,0.15)" : "rgba(16,185,129,0.15)",
                        color: userRole === "ADMIN" ? "#818cf8" : "#34d399",
                        border: userRole === "ADMIN" ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(16,185,129,0.3)"
                    }}>{userRole}</span>
                    {userRole === "ADMIN" && (
                        <button className="auth-button" style={{ width: "auto", padding: "10px 20px" }} onClick={handleOpenAddModal}>Add Vehicle</button>
                    )}
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "8px",
                            border: "1px solid rgba(239,68,68,0.4)",
                            background: "rgba(239,68,68,0.1)",
                            color: "#f87171",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "14px",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={e => { e.target.style.background = "rgba(239,68,68,0.2)"; e.target.style.borderColor = "rgba(239,68,68,0.6)"; }}
                        onMouseLeave={e => { e.target.style.background = "rgba(239,68,68,0.1)"; e.target.style.borderColor = "rgba(239,68,68,0.4)"; }}
                    >Logout</button>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="tab-switcher">
                {["inventory", "purchases"].map((tab) => {
                    const label = tab === "inventory" ? "🚗 Inventory" : (userRole === "ADMIN" ? "📊 Sales History" : "🛒 My Purchases");
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className="tab-btn"
                            style={{
                                borderBottom: isActive ? "2px solid #818cf8" : "2px solid transparent",
                                color: isActive ? "#818cf8" : "var(--text-secondary)",
                                fontWeight: isActive ? "700" : "500"
                            }}
                        >{label}</button>
                    );
                })}
            </div>

            {activeTab === "inventory" ? (
                <>
                    {/* Sleek Filter-Wise Search Bar */}
                    <div className="filter-bar-container">
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "14px" }}>
                            <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-h)" }}>Filter By:</label>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                {[
                                    { key: "make", label: "🚗 Make" },
                                    { key: "model", label: "🏎️ Model" },
                                    { key: "category", label: "📂 Category" },
                                    { key: "price", label: "💰 Price Range" },
                                    { key: "all", label: "⚙️ Advanced (All)" }
                                ].map(type => (
                                    <button
                                        key={type.key}
                                        type="button"
                                        onClick={() => setActiveFilterType(type.key)}
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: "20px",
                                            border: activeFilterType === type.key ? "1px solid var(--accent)" : "1px solid var(--border)",
                                            background: activeFilterType === type.key ? "var(--accent-bg)" : "var(--code-bg)",
                                            color: activeFilterType === type.key ? "var(--accent)" : "var(--text)",
                                            fontSize: "13px",
                                            fontWeight: activeFilterType === type.key ? "600" : "400",
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}
                                    >{type.label}</button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-inputs-row">
                            {(activeFilterType === "make" || activeFilterType === "all") && (
                                <div className="form-group" style={{ flex: 1, minWidth: "160px", marginBottom: 0 }}>
                                    <label htmlFor="search-make" style={{ fontSize: "12px", marginBottom: "4px" }}>Search Make</label>
                                    <input
                                        id="search-make"
                                        name="make"
                                        type="text"
                                        value={filters.make}
                                        onChange={handleFilterChange}
                                        placeholder="Search Make (e.g. Susuzi, Toyota)..."
                                        style={{ padding: "8px 12px" }}
                                    />
                                </div>
                            )}
                            {(activeFilterType === "model" || activeFilterType === "all") && (
                                <div className="form-group" style={{ flex: 1, minWidth: "160px", marginBottom: 0 }}>
                                    <label htmlFor="search-model" style={{ fontSize: "12px", marginBottom: "4px" }}>Search Model</label>
                                    <input
                                        id="search-model"
                                        name="model"
                                        type="text"
                                        value={filters.model}
                                        onChange={handleFilterChange}
                                        placeholder="Search Model (e.g. Victoris)..."
                                        style={{ padding: "8px 12px" }}
                                    />
                                </div>
                            )}
                            {(activeFilterType === "category" || activeFilterType === "all") && (
                                <div className="form-group" style={{ flex: 1, minWidth: "160px", marginBottom: 0 }}>
                                    <label htmlFor="search-category" style={{ fontSize: "12px", marginBottom: "4px" }}>Search Category</label>
                                    <input
                                        id="search-category"
                                        name="category"
                                        type="text"
                                        value={filters.category}
                                        onChange={handleFilterChange}
                                        placeholder="Search Category (e.g. Sedan, SUV)..."
                                        style={{ padding: "8px 12px" }}
                                    />
                                </div>
                            )}
                            {(activeFilterType === "price" || activeFilterType === "all") && (
                                <>
                                    <div className="form-group" style={{ flex: 1, minWidth: "120px", marginBottom: 0 }}>
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
                                    <div className="form-group" style={{ flex: 1, minWidth: "120px", marginBottom: 0 }}>
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
                                </>
                            )}
                            <div className="filter-actions-mobile" style={{ display: "flex", gap: "8px" }}>
                                <button className="auth-button" style={{ padding: "10px 20px" }} onClick={handleSearch}>Search</button>
                                <button className="auth-button btn-secondary" style={{ padding: "10px 16px" }} onClick={handleClearFilters}>Reset</button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading inventory...</p>
                    ) : vehicles.length === 0 ? (
                        <p>No vehicles in inventory.</p>
                    ) : (
                        <div className="bw-cards-grid">
                            {vehicles.map((v) => (
                                <div key={v.id} className="bw-card">
                                    <div>
                                        <div className="bw-card-header">
                                            <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", color: "#6b7280" }}>
                                                {v.category || "VEHICLE"}
                                            </span>
                                            <span style={{
                                                padding: "4px 10px",
                                                borderRadius: "12px",
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                background: v.status === "AVAILABLE" ? "#111827" : "#ef4444",
                                                color: "#ffffff"
                                            }}>{v.status}</span>
                                        </div>
                                        <div className="bw-card-title">
                                            {v.make} {v.model}
                                            <span style={{ display: "none" }}>{v.make}</span>
                                            <span style={{ display: "none" }}>{v.model}</span>
                                        </div>
                                        <div className="bw-card-price">
                                            ${Number(v.price).toLocaleString()}
                                            <span style={{ display: "none" }}>{v.price}</span>
                                        </div>
                                        <div className="bw-card-specs">
                                            <div><strong>Year:</strong> {v.year}</div>
                                            <div>
                                                <strong>Stock:</strong> {v.quantity} units
                                                <span style={{ display: "none" }}>{v.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bw-card-actions">
                                        {userRole === "ADMIN" && (
                                            <>
                                                <button className="auth-button" style={{ flex: 1, padding: "8px 10px", fontSize: "13px", background: "#000000" }} onClick={() => handleOpenEditModal(v)}>Edit</button>
                                                <button className="auth-button" style={{ flex: 1, padding: "8px 10px", fontSize: "13px", background: "#374151" }} onClick={() => handleOpenRestockModal(v.id)}>Restock</button>
                                                <button className="auth-button btn-danger" style={{ flex: 1, padding: "8px 10px", fontSize: "13px" }} onClick={() => handleDelete(v.id)}>Delete</button>
                                            </>
                                        )}
                                        {userRole === "USER" && v.status === "AVAILABLE" && (
                                            <button className="auth-button" style={{ width: "100%", padding: "10px 14px", background: "#000000" }} onClick={() => handlePurchase(v.id)}>Buy Now</button>
                                        )}
                                        {userRole === "USER" && v.status === "SOLD" && (
                                            <span style={{ color: "#6b7280", fontSize: "13px", padding: "6px 0", width: "100%", textAlign: "center" }}>Out of Stock</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    {salesLoading ? (
                        <p>Loading sales records...</p>
                    ) : sales.length === 0 ? (
                        <p>{userRole === "ADMIN" ? "No sales records found." : "You have not purchased any vehicles yet."}</p>
                    ) : (
                        <div className="bw-cards-grid">
                            {sales.map((sale) => (
                                <div key={sale.id} className="bw-card">
                                    <div>
                                        <div className="bw-card-header">
                                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#6b7280" }}>PURCHASE RECORD</span>
                                            <span style={{ fontSize: "14px", fontWeight: 800, color: "#000000" }}>
                                                ${Number(sale.purchasePrice).toLocaleString()}
                                                <span style={{ display: "none" }}>{sale.purchasePrice}</span>
                                            </span>
                                        </div>
                                        <div className="bw-card-title">
                                            {sale.vehicleMake} {sale.vehicleModel}
                                            <span style={{ display: "none" }}>{sale.vehicleMake}</span>
                                            <span style={{ display: "none" }}>{sale.vehicleModel}</span>
                                        </div>
                                        <div className="bw-card-specs">
                                            <div><strong>Year:</strong> {sale.vehicleYear}</div>
                                            <div><strong>Date:</strong> {new Date(sale.purchasedAt).toLocaleDateString()}</div>
                                            {userRole === "ADMIN" && <div style={{ gridColumn: "1 / -1" }}><strong>Buyer:</strong> {sale.buyerEmail}</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {actionMessage && (
                <div style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    background: "var(--code-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "14px 20px",
                    color: "var(--text-h)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                    zIndex: 9999,
                    maxWidth: "320px",
                    fontSize: "14px"
                }}>{actionMessage}</div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <div className="modal-header">
                            <h2>{modalMode === "add" ? "Add Vehicle" : "Edit Vehicle"}</h2>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        {error && <div className="auth-error">{error}</div>}
                        <form onSubmit={handleFormSubmit} className="auth-form" style={{ gap: "14px" }}>
                            <div className="modal-form-grid">
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
                            </div>
                            <div className="modal-form-grid">
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
                            </div>
                            <div className="modal-form-grid">
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
                            </div>
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    style={{ font: "inherit", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)" }}
                                >
                                    <option value="AVAILABLE">AVAILABLE</option>
                                    <option value="SOLD">SOLD</option>
                                </select>
                            </div>
                             <div className="modal-actions" style={{ marginTop: "8px" }}>
                                <button type="button" className="auth-button btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="auth-button">Save</button>
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
                            <button className="auth-button btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                            <button className="auth-button btn-danger" onClick={handleConfirmDelete}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
            {isRestockModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-card" style={{ maxWidth: "400px" }}>
                        <div className="modal-header">
                            <h2>Restock Vehicle</h2>
                            <button className="modal-close" onClick={() => setIsRestockModalOpen(false)}>&times;</button>
                        </div>
                        <div className="form-group" style={{ margin: "16px 0" }}>
                            <label htmlFor="restock-quantity" style={{ display: "block", marginBottom: "8px" }}>Quantity to Add</label>
                            <input
                                id="restock-quantity"
                                type="number"
                                min={1}
                                value={restockQty}
                                onChange={(e) => setRestockQty(Number(e.target.value))}
                                style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-h)", font: "inherit" }}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="auth-button btn-secondary" onClick={() => setIsRestockModalOpen(false)}>Cancel</button>
                            <button className="auth-button" style={{ background: "#7c3aed" }} onClick={handleConfirmRestock}>Confirm Restock</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
