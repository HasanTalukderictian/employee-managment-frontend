import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // টোস্ট ইম্পোর্ট
import Header from "./Header"; 
import Menu from "./Menu"; 

const AddDesgination = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const loadingToast = toast.loading("Creating designation...");

    try {
      const response = await fetch(`${BASE_URL}/api/add-desi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        toast.success("Designation created successfully!", { id: loadingToast });
        setName("");
        setTimeout(() => navigate("/admin-desgination"), 1000);
      } else {
        throw new Error("Failed to add");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to create designation.", { id: loadingToast });
    }
  };

  return (
    <>
      {/* টোস্ট মেসেজ দেখার জন্য এটি প্রয়োজন */}
      <Toaster position="top-right" reverseOrder={false} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: '1890px',
          height: '1024px',
          margin: "0 auto",
          boxSizing: "border-box",
          backgroundColor: "#f8f9fa"
        }}
      >
        <Header />
        <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          <Menu />
          <main style={{ flexGrow: 1, padding: "40px", overflowY: "auto" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              
              {/* Back Button */}
              <div style={{ marginBottom: "25px" }}>
                <Link to="/admin-desgination" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      padding: "10px 20px",
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
                    ← Back to List
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
                <div style={{ marginBottom: "30px", borderBottom: "2px solid #28a745", paddingBottom: "10px", display: "inline-block" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#2d3436", margin: 0 }}>
                        Add New Designation
                    </h2>
                </div>

                <div className="mb-4">
                  <label 
                    htmlFor="name" 
                    style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: "#555", fontSize: "16px" }}
                  >
                    Designation Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="e.g. Senior Software Engineer"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: "10px",
                      border: "1px solid #ced4da",
                      fontSize: "16px",
                      outline: "none",
                      transition: "border-color 0.3s ease"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#28a745")}
                    onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ marginTop: "30px" }}>
                  <button 
                    type="submit" 
                    style={{
                      width: "160px",
                      padding: "14px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 4px 6px rgba(40, 167, 69, 0.2)",
                      transition: "transform 0.2s, background-color 0.3s"
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#218838")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
                  >
                    Create Now
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

export default AddDesgination;