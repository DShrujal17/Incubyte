import React, { useEffect, useState } from "react";
import { getAllVehicles } from "../services/vehicleService";

export default function Dashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const data = await getAllVehicles();
                setVehicles(data || []);
            } catch (err) {
                console.error("Failed to load inventory:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    return (
        <div className="dashboard-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ margin: 0 }}>Dashboard</h1>
                <button className="auth-button" style={{ width: "auto", padding: "10px 20px" }}>Add Vehicle</button>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
