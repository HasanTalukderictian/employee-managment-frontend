import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import Menu from "./Menu";

const AddSalary = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
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

    // থিম কনফিগারেশন
    const theme = {
        bg: darkMode ? '#0f172a' : '#f4f7f6',
        cardBg: darkMode ? '#1e293b' : '#ffffff',
        text: darkMode ? '#f8fafc' : '#2d3436',
        label: darkMode ? '#94a3b8' : '#555',
        inputBg: darkMode ? '#0f172a' : '#ffffff',
        border: darkMode ? '#334155' : '#eee',
        buttonBg: darkMode ? '#334155' : '#fff',
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/get-employee`);
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
                    width: '100%',
                    minHeight: '100vh',
                    margin: "0 auto",
                    boxSizing: "border-box",
                    backgroundColor: theme.bg,
                    transition: 'all 0.3s ease'
                }}
            >
                {/* Header এ প্রপস পাস */}
                <Header darkMode={darkMode} setDarkMode={setDarkMode} />

                <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                    {/* Menu তে প্রপস পাস */}
                    <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

                    <main style={{ flexGrow: 1, padding: "40px", overflowY: "auto" }}>
                        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

                            {/* Form Card */}
                            <form
                                onSubmit={handleSubmit}
                                style={{
                                    background: theme.cardBg,
                                    borderRadius: "16px",
                                    boxShadow: darkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.08)",
                                    padding: "40px",
                                    border: `1px solid ${theme.border}`,
                                    color: theme.text,
                                    transition: 'all 0.3s ease',
                                    // বাটন বামে আনার জন্য নিচের ৩টি প্রপার্টি যোগ করা হয়েছে
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start"
                                }}
                            >
                                {/* Back Button - এখন এটি একদম বাম প্রান্ত থেকে শুরু হবে */}
                                <Link to="/admin-salary" style={{ textDecoration: 'none', marginBottom: "25px" }}>
                                    <button
                                        style={{
                                            padding: "10px 22px",
                                            fontSize: "15px",
                                            backgroundColor: theme.buttonBg,
                                            border: `1px solid ${theme.border}`,
                                            borderRadius: "8px",
                                            color: theme.text,
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        ← Back to Salary List
                                    </button>
                                </Link>

                                {/* Title Section */}
                                <div style={{ textAlign: "left", marginBottom: "30px" }}>
                                    <h2 style={{
                                        fontSize: "24px",
                                        fontWeight: "700",
                                        color: theme.text,
                                        borderBottom: "2px solid #0d6efd",
                                        display: "inline-block",
                                        paddingBottom: "5px",
                                        margin: 0
                                    }}>
                                        Add Employee Salary
                                    </h2>
                                </div>

                                {/* Form Fields Row - width 100% দেওয়া হয়েছে যাতে গ্রিড ঠিক থাকে */}
                                <div className="row g-4" style={{ width: "100%", textAlign: "left" }}>
                                    {/* Employee Selection */}
                                    <div className="col-md-12">
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: theme.label }}>Employee Name</label>
                                        <select
                                            name="employee_id"
                                            className="form-select form-select-lg"
                                            style={{
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                background: theme.inputBg,
                                                color: theme.text,
                                                border: `1px solid ${theme.border}`
                                            }}
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
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: theme.label }}>Salary Month</label>
                                        <select
                                            name="month"
                                            className="form-select"
                                            style={{
                                                borderRadius: "10px",
                                                padding: "12px",
                                                background: theme.inputBg,
                                                color: theme.text,
                                                border: `1px solid ${theme.border}`
                                            }}
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
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: theme.label }}>Salary Year</label>
                                        <select
                                            name="year"
                                            className="form-select"
                                            style={{
                                                borderRadius: "10px",
                                                padding: "12px",
                                                background: theme.inputBg,
                                                color: theme.text,
                                                border: `1px solid ${theme.border}`
                                            }}
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
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: theme.label }}>Basic Salary (৳)</label>
                                        <input
                                            type="number"
                                            name="basic"
                                            placeholder="0.00"
                                            className="form-control"
                                            style={{
                                                borderRadius: "10px",
                                                padding: "12px",
                                                background: theme.inputBg,
                                                color: theme.text,
                                                border: `1px solid ${theme.border}`
                                            }}
                                            value={formData.basic}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: theme.label }}>Bonus (৳)</label>
                                        <input
                                            type="number"
                                            name="bonus"
                                            placeholder="0.00"
                                            className="form-control"
                                            style={{
                                                borderRadius: "10px",
                                                padding: "12px",
                                                background: theme.inputBg,
                                                color: theme.text,
                                                border: `1px solid ${theme.border}`
                                            }}
                                            value={formData.bonus}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: theme.label }}>Deductions (৳)</label>
                                        <input
                                            type="number"
                                            name="deductions"
                                            placeholder="0.00"
                                            className="form-control"
                                            style={{
                                                borderRadius: "10px",
                                                padding: "12px",
                                                background: theme.inputBg,
                                                color: theme.text,
                                                border: `1px solid ${theme.border}`
                                            }}
                                            value={formData.deductions}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Date */}
                                    <div className="col-md-12">
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: theme.label }}>Payment Date</label>
                                        <input
                                            type="date"
                                            name="payment_date"
                                            className="form-control"
                                            style={{
                                                borderRadius: "10px",
                                                padding: "12px",
                                                background: theme.inputBg,
                                                color: theme.text,
                                                border: `1px solid ${theme.border}`
                                            }}
                                            value={formData.payment_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Submit Button - এটি ডান দিকেই থাকবে */}
                                <div style={{ marginTop: "40px", textAlign: "right", width: "100%" }}>
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