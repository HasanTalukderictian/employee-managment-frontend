import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header"; // Import if available
import Menu from "./Menu"; // Import if available

const AddDepartment = () => {
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${BASE_URL}/api/add-dept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();
      console.log("Server Response:", result);
      alert("Employee added successfully!");

      setName("");
      navigate("/admin-department");
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to add employee.");
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




              <form onSubmit={handleSubmit}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  padding: "30px",
                  marginTop: "10px"
                }}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fs-5 text-start h2 d-block">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control h2"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mt-4">
                  <button type="submit" className="btn btn-warning text-white w-30">
                    Submit
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

export default AddDepartment;
