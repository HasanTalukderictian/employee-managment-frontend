import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header"; // Import if available
import Menu from "./Menu"; // Import if available

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
            }
        };

        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/api/add-salary`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            alert(result.message);
                  navigate("/admin-salary");
        } catch (err) {
            alert("Error submitting form", err);
        }
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: '1890px',
                    height: '1024px',
                    margin: "0 auto",
                    boxSizing: "border-box",
                }}
            >
                <Header />
                <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                    <Menu />
                    <main style={{ flexGrow: 1, padding: "20px", overflowY: "auto" }}>
                        <div className="container mt-10">

                            <div className="mb-4">
                                <Link to="/admin-department">
                                    <button
                                        className="btn"
                                        style={{
                                            fontSize: "16px",
                                            backgroundColor: "transparent",
                                            border: "1px solid #ccc",
                                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                                            color: "black",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            transition: "opacity 0.3s ease, box-shadow 0.3s ease"
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.opacity = "0.6";
                                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.opacity = "1";
                                            e.currentTarget.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.15)";
                                        }}
                                    >
                                        ← Back
                                    </button>
                                </Link>
                            </div>




                            <form onSubmit={handleSubmit} className="mb-4"
                                style={{
                                    background: "#ffffff",
                                    borderRadius: "16px",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                    padding: "30px",
                                    minHeight: "400px",
                                    paddingBottom: "100px",
                                    position: "relative",
                                }}
                            >
                                <div className="row mb-3 mt-5">
                                    <div className="col-md-6">
                                        <label className="form-label fs-5 text-start h2 d-block">Employee Name</label>
                                        <select
                                            name="employee_id"
                                            className="form-select"
                                            value={formData.employee_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select employee</option>
                                            {employees.map((emp) => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.first_name} {emp.last_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                    <div className="col-md-6">
                                        <label className="form-label fs-5 text-start h2 d-block">Month</label>
                                        <select
                                            name="month"
                                            className="form-select"
                                            value={formData.month}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Month</option>
                                            <option value="January">January</option>
                                            <option value="February">February</option>
                                            <option value="March">March</option>
                                            <option value="April">April</option>
                                            <option value="May">May</option>
                                            <option value="June">June</option>
                                            <option value="July">July</option>
                                            <option value="August">August</option>
                                            <option value="September">September</option>
                                            <option value="October">October</option>
                                            <option value="November">November</option>
                                            <option value="December">December</option>
                                        </select>
                                    </div>


                                    <div className="col-md-6">
                                        <label className="form-label fs-5 text-start h2 d-block">Year</label>
                                        <select
                                            name="year"
                                            className="form-select"
                                            value={formData.year}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Year</option>
                                            {Array.from({ length: 15 }, (_, i) => {
                                                const year = 2020 + i;
                                                return (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>


                                    {/* 👇 Parallel row for Basic + Bonus */}
                                    <div className="col-md-6 d-flex gap-3">
                                        <div className="w-50">
                                            <label className="form-label fs-5 text-start h2 d-block">Basic</label>
                                            <input
                                                type="number"
                                                name="basic"
                                                className="form-control"
                                                value={formData.basic}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="w-50">
                                            <label className="form-label fs-5 text-start h2 d-block">Bonus</label>
                                            <input
                                                type="number"
                                                name="bonus"
                                                className="form-control"
                                                value={formData.bonus}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fs-5 text-start h2 d-block">Deductions</label>
                                        <input
                                            type="number"
                                            name="deductions"
                                            className="form-control"
                                            value={formData.deductions}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fs-5 text-start h2 d-block">Payment Date</label>
                                        <input
                                            type="date"
                                            name="payment_date"
                                            className="form-control"
                                            value={formData.payment_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary mt-3">
                                    Submit Salary
                                </button>
                            </form>

                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default AddSalary;
