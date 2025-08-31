import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Menu from "./Menu";
import Footer from "./Footer";
import Header from "./Header";

const EditEmployee = () => {
    const [employee, setEmployee] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        date_of_birth: "",
        gender: "",
        status: "",
        hire_date: "", // ✅ Added to match form input
    });

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const { id } = useParams();
    const dateInputRef = useRef(null);

    useEffect(() => {
        axios
            .get(`${BASE_URL}/api/get-employee/${id}`)
            .then((res) => {
                if (res.data?.employee) {
                    setEmployee(res.data.employee);
                }
            })
            .catch((error) => {
                console.error("Error fetching employee:", error);
            });
    }, [id, BASE_URL]);

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };



    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (let key in employee) {
            formData.append(key, employee[key]);
        }

        axios
            .post(`${BASE_URL}/api/update-emplyee/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                navigate("/admin-employee");
            })
            .catch((error) => {
                console.error("Error updating employee:", error.response?.data || error.message);
            });
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '1890px',
                height: '1024px',
                margin: '0 auto',
                border: '1px solid #ccc',
                boxSizing: 'border-box',

            }}
        >
            <Header />
            <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                <Menu />
                <main
                    style={{
                        flexGrow: 1,
                        padding: "40px",
                        background: "linear-gradient(to bottom right, #ffffff, #f0eee7)",
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
                        minHeight: "100vh",
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                >
                    <div className="container mt-4">

                        <div className="d-flex align-items-center mb-3" style={{ position: "relative" }}>
                            <button
                                onClick={() => navigate(-1)}
                                className="btn text-decoration-none"
                                style={{
                                    fontSize: "16px",
                                    backgroundColor: "transparent",
                                    border: "1px solid #ccc",
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                                    transition: "opacity 0.3s ease",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.5")}
                                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                            >
                                ← Back
                            </button>

                            <h3
                                className="flex-grow-1 text-center mb-0"
                                style={{
                                    fontFamily: "sans-serif",
                                    cursor: "default" // prevents the text selection cursor
                                }}
                            >
                                Edit Employee
                            </h3>
                            <div style={{ width: "75px" }}></div>
                        </div>


                        <form
                            onSubmit={handleSubmit}
                            style={{
                                background: "#ffffff",
                                borderRadius: "16px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                padding: "30px",
                            }}
                        >
                            <div className="row mb-3">
                                <div className="col">
                                    <label className="form-label fs-5 text-start h2 d-block">First Name</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        className="form-control"
                                        value={employee.first_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <label className="form-label fs-5 text-start h2 d-block">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        className="form-control"
                                        value={employee.last_name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col">
                                    <label className="form-label fs-5 text-start h2 d-block">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={employee.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <label className="form-label fs-5 text-start h2 d-block">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="form-control"
                                        value={employee.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col">
                                    <label className="form-label fs-5 text-start h2 d-block">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        className="form-control"
                                        value={employee.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col">
                                    <label className="form-label fs-5 text-start h2 d-block">Hiring Date</label>
                                    <input
                                        type="date"
                                        name="hire_date"
                                        ref={dateInputRef}
                                        className="form-control"
                                        value={employee.hire_date}
                                        onChange={handleChange}
                                        onFocus={() => dateInputRef.current?.showPicker?.()}
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col">
                                    <label className="form-label fs-5 text-start h2 d-block">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        className="form-control"
                                        value={employee.date_of_birth}
                                        onChange={handleChange}

                                    />
                                </div>
                                <div className="col">
                                    <label className="form-label fs-5 text-start h2 d-block">Gender</label>
                                    <select
                                        name="gender"
                                        className="form-control"
                                        value={employee.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>


                            <div className="row mb-3">
                                <div className="col">
                                    <label className="form-label fs-5 text-start h2 d-block">Status</label>
                                    <select
                                        name="status"
                                        className="form-control"
                                        value={employee.status}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>


                                <div className="col">
                                    <label className="form-label fs-5 text-start h2 d-block">Salary</label>
                                    <input
                                        type="text"
                                        name="salary"
                                        className="form-control"
                                        value={employee.salary}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>







                            <div className="mb-3">
                                <label className="form-label fs-5 text-start h2 d-block">Profile Picture</label>
                                <input
                                    type="file"
                                    name="profile_picture"
                                    className="form-control"
                                    onChange={(e) => setEmployee({ ...employee, profile_picture: e.target.files[0] })}
                                />
                            </div>

                            <button type="submit" className="btn btn-warning text-white">
                                Update
                            </button>
                        </form>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default EditEmployee;
