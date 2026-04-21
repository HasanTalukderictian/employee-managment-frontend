import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // Toast Import
import Header from "./Header"; 
import Menu from "./Menu"; 

const AddSalary = () => {
    const [formData, setFormData] = useState({
        employee_id: "",
        month: "",
        year: "",
        basic: "",
        bonus: "",
        deductions: "",
        payment_date: "",
    });
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/get-emplyee`);
                const data = await res.json();
                setEmployees(data.data || []);
            } catch (err) {
                console.error("Failed to fetch employees", err);
                toast.error("Failed to load employee list");
            }
        };
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading("Submitting salary data...");
        try {
            const res = await fetch(`${BASE_URL}/api/add-salary`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            
            if (res.ok) {
                toast.success(result.message || "Salary added successfully!", { id: loadingToast });
                setTimeout(() => navigate("/admin-salary"), 1500);
            } else {
                toast.error(result.message || "Failed to add salary", { id: loadingToast });
            }
        } catch (err) {
            toast.error("Error submitting form", { id: loadingToast });
        }
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: '1890px',
                    height: '1024px',
                    margin: "0 auto",
                    boxSizing: "border-box",
                    backgroundColor: "#f4f7f6"
                }}
            >
                <Header />
                <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                    <Menu />
                    <main style={{ flexGrow: 1, padding: "40px", overflowY: "auto" }}>
                        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                            
                            {/* Back Button */}
                            <div style={{ marginBottom: "25px" }}>
                                <Link to="/admin-salary" style={{ textDecoration: 'none' }}>
                                    <button
                                        style={{
                                            padding: "10px 22px",
                                            fontSize: "15px",
                                            backgroundColor: "#fff",
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                            color: "#333",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease"
                                        }}
                                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f1f1f1")}
                                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                                    >
                                        ← Back to Salary List
                                    </button>
                                </Link>
                            </div>

                            {/* Form Card */}
                            <form 
                                onSubmit={handleSubmit} 
                                style={{
                                    background: "#ffffff",
                                    borderRadius: "16px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                    padding: "40px",
                                    border: "1px solid #eee"
                                }}
                            >
                                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#2d3436", marginBottom: "30px", borderBottom: "2px solid #0d6efd", display: "inline-block", paddingBottom: "5px" }}>
                                    Add Employee Salary
                                </h2>

                                <div className="row g-4">
                                    {/* Employee Selection */}
                                    <div className="col-md-12">
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Employee Name</label>
                                        <select
                                            name="employee_id"
                                            className="form-select form-select-lg"
                                            style={{ borderRadius: "10px", fontSize: "16px" }}
                                            value={formData.employee_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Choose an employee...</option>
                                            {employees.map((emp) => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.first_name} {emp.last_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Month & Year */}
                                    <div className="col-md-6">
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Salary Month</label>
                                        <select
                                            name="month"
                                            className="form-select"
                                            style={{ borderRadius: "10px", padding: "12px" }}
                                            value={formData.month}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Month</option>
                                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Salary Year</label>
                                        <select
                                            name="year"
                                            className="form-select"
                                            style={{ borderRadius: "10px", padding: "12px" }}
                                            value={formData.year}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Year</option>
                                            {Array.from({ length: 10 }, (_, i) => {
                                                const year = new Date().getFullYear() - 2 + i;
                                                return <option key={year} value={year}>{year}</option>;
                                            })}
                                        </select>
                                    </div>

                                    {/* Salary Details */}
                                    <div className="col-md-4">
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Basic Salary (৳)</label>
                                        <input
                                            type="number"
                                            name="basic"
                                            placeholder="0.00"
                                            className="form-control"
                                            style={{ borderRadius: "10px", padding: "12px" }}
                                            value={formData.basic}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Bonus (৳)</label>
                                        <input
                                            type="number"
                                            name="bonus"
                                            placeholder="0.00"
                                            className="form-control"
                                            style={{ borderRadius: "10px", padding: "12px" }}
                                            value={formData.bonus}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Deductions (৳)</label>
                                        <input
                                            type="number"
                                            name="deductions"
                                            placeholder="0.00"
                                            className="form-control"
                                            style={{ borderRadius: "10px", padding: "12px" }}
                                            value={formData.deductions}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Date */}
                                    <div className="col-md-12">
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>Payment Date</label>
                                        <input
                                            type="date"
                                            name="payment_date"
                                            className="form-control"
                                            style={{ borderRadius: "10px", padding: "12px" }}
                                            value={formData.payment_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ marginTop: "40px", textAlign: "right" }}>
                                    <button 
                                        type="submit" 
                                        style={{
                                            padding: "15px 40px",
                                            backgroundColor: "#0d6efd",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "10px",
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            cursor: "pointer",
                                            boxShadow: "0 4px 15px rgba(13, 110, 253, 0.3)",
                                            transition: "all 0.3s ease"
                                        }}
                                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0b5ed7")}
                                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0d6efd")}
                                    >
                                        Submit Salary Record
                                    </button>
                                </div>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default AddSalary;