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
            <div className="container mt-4">
              <div className="mb-3">
                <Link to="/admin-department">
                  <button className="btn btn-secondary">
                    Back
                  </button>
                </Link>
              </div>

              <form onSubmit={handleSubmit}>
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
                  <button type="submit" className="btn btn-primary w-100">
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
