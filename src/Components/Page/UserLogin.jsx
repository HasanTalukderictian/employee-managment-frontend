import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

const UserLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
  

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const loginToast = toast.loading("Verifying credentials...");

        try {
            const response = await fetch(`${BASE_URL}/api/users-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Login successful!", { id: loginToast });

                // Store essential data
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("isAdminLoggedIn", true); // Keeping consistency with your logic
                localStorage.setItem('userRole', data.data.role);
                localStorage.setItem("employee_id", data.data.employee_id);
                localStorage.setItem("employee_name", data.data.employee_first_name);

                setTimeout(() => navigate("/admin-home"), 1000);
            } else {
                toast.error(data.error || "Login failed! Check your email/password.", { id: loginToast });
            }
        } catch (error) {
            toast.error("Server error. Please try again later.", { id: loginToast });
            console.error("Login Error:", error);
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
            padding: "20px"
        }}>
            <Toaster position="top-center" reverseOrder={false} />

            <div className="card shadow-lg border-0" style={{
                width: "100%",
                maxWidth: "500px",
                borderRadius: "20px",
                overflow: "hidden"
            }}>
                <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                        {/* User Icon */}
                        <div className="mb-3">
                            <i className="bi bi-person-circle" style={{ fontSize: "70px", color: "#07f747" }}></i>
                        </div>
                        <h3 className="fw-bold" style={{ color: "#2c3e50", letterSpacing: "-0.5px" }}>
                            Employee Login
                        </h3>
                        <p className="text-muted small">Enter your details to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold small text-secondary">Email Address</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "12px 0 0 12px" }}>
                                    <i className="bi bi-envelope-at" style={{ color: '#07f747', fontSize: "20px" }}></i>
                                </span>
                                <input
                                    type="email"
                                    className="form-control form-control-lg border-start-0"
                                    placeholder="name@company.com"
                                    style={{ borderRadius: "0 12px 12px 0", fontSize: "16px", backgroundColor: "#fff" }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold small text-secondary">Password</label>
                            <div className="input-group">
                                <span
                                    className="input-group-text bg-white border-end-0"
                                    style={{ cursor: "pointer", borderRadius: "12px 0 0 12px" }}
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                >
                                    <i className={`bi ${isPasswordVisible ? "bi-unlock-fill" : "bi-lock-fill"}`} style={{ color: '#07f747', fontSize: "20px" }}></i>
                                </span>
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    className="form-control form-control-lg border-start-0"
                                    placeholder="••••••••"
                                    style={{ borderRadius: "0 12px 12px 0", fontSize: "16px", backgroundColor: "#fff" }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn w-100 py-3 mt-2 shadow-sm"
                            style={{
                                backgroundColor: "#d60acc",
                                borderColor: "#d60acc",
                                color: "#fff",
                                fontSize: "18px",
                                fontWeight: "700",
                                borderRadius: "12px",
                                transition: "all 0.3s ease"
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = "#0ee85e";
                                e.target.style.transform = "translateY(-2px)";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = "#d60acc";
                                e.target.style.transform = "translateY(0px)";
                            }}
                        >
                            {isSubmitting ? (
                                <span><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</span>
                            ) : "Login"}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-muted small">Forgot password? Contact your Administrator</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;