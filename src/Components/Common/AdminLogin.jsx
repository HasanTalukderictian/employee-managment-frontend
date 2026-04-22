import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const loginToast = toast.loading("Authenticating...");

        try {
            const response = await fetch(`${BASE_URL}/api/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Login successful!", { id: loginToast });
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("isAdminLoggedIn", true);
                //    localStorage.setItem('userRole', data.data.role);
                setTimeout(() => navigate("/admin-home"), 1000);
            } else {
                toast.error(data.error || "Login failed!", { id: loginToast });
            }
        } catch (error) {
            toast.error("An error occurred. Try again.", { id: loginToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ 
            minHeight: "100vh", 
            width: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            backgroundColor: "#f8f9fa",
            padding: "20px" // Mobile-e side theke gap rakhar jonno
        }}>
            <Toaster position="top-center" />
            
            <div className="card shadow-lg border-0" style={{ 
                width: "100%", 
                maxWidth: "500px", // 800px theke 500px kora hoyeche standard login box er jonno
                borderRadius: "20px",
                overflow: "hidden"
            }}>
                <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                        <i className="bi bi-person-circle" style={{ fontSize: "70px", color: "#07f747" }}></i>
                        <h3 className="fw-bold mt-2" style={{ color: "#2c3e50" }}>Employee Management</h3>
                        <p className="text-muted">Admin Portal Access</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-semibold">Email Address</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "10px 0 0 10px" }}>
                                    <i className="bi bi-envelope-fill" style={{ color: '#07f747', fontSize: "20px" }}></i>
                                </span>
                                <input
                                    type="email"
                                    className="form-control form-control-lg border-start-0"
                                    placeholder="admin@example.com"
                                    style={{ borderRadius: "0 10px 10px 0", fontSize: "16px" }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Password</label>
                            <div className="input-group">
                                <span 
                                    className="input-group-text bg-white border-end-0" 
                                    style={{ cursor: "pointer", borderRadius: "10px 0 0 10px" }}
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                >
                                    <i className={`bi ${isPasswordVisible ? "bi-unlock-fill" : "bi-lock-fill"}`} style={{ color: '#07f747', fontSize: "20px" }}></i>
                                </span>
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    className="form-control form-control-lg border-start-0"
                                    placeholder="••••••••"
                                    style={{ borderRadius: "0 10px 10px 0", fontSize: "16px" }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn w-100 py-3 shadow-sm"
                            style={{
                                backgroundColor: "#d60acc",
                                borderColor: "#d60acc",
                                color: "#fff",
                                fontSize: "18px",
                                fontWeight: "700",
                                borderRadius: "12px",
                                transition: "0.3s"
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#0ee85e"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#d60acc"}
                        >
                            {isSubmitting ? "Processing..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;