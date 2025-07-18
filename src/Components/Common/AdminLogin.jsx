import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (submittedData) {
      const { email, password } = submittedData;

      const login = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/admin/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          console.log(data);

          if (response.ok) {
            const token = data.token;
            setResponseMessage(data.message || "Login successful!");
            localStorage.setItem("authToken", token);
            localStorage.setItem("isAdminLoggedIn", true);
            setShowModal(true);
            setTimeout(() => {
              setShowModal(false);
              navigate("/admin-home");
            }, 1000);
          } else {
            setResponseMessage(data.error || "Login failed! Please check your credentials.");
            setShowModal(true);
          }
        } catch (error) {
          setResponseMessage("An error occurred. Please try again later.");
          setShowModal(true);
          console.error("Error during login:", error);
        }
      };

      login();
    }
  }, [submittedData, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData({ email, password });
  };

  return (
    <div>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-4" style={{ maxWidth: "800px", width: "100%" }}>
          <div className="text-center mb-4 mt-8">
            <img
              src="/images/logo.png" // Replace with your logo path
              alt="Logo"
              className="rounded-circle mb-3"
              style={{ width: "80px" }}
            />
            <h3>Employee Management System</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <i className={`bi ${isPasswordVisible ? "bi-unlock-fill" : "bi-lock-fill"}`}></i>
                </span>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  className="form-control"
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Notification</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>{responseMessage}</p>
            </div>
          </div>
        </div>
      </div>

      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default AdminLogin;
