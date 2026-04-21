import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; // টোস্ট ইম্পোর্ট করা হয়েছে
import Header from "./Header"; 
import Menu from "./Menu"; 

const AddDepartment = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    // লোডিং টোস্ট দেখানোর জন্য
    const loadingToast = toast.loading("Adding department...");

    try {
      const response = await fetch(`${BASE_URL}/api/add-dept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        // সাকসেস টোস্ট
        toast.success("Department added successfully!", { id: loadingToast });
        setName("");
        setTimeout(() => navigate("/admin-department"), 1500); // একটু দেরি করে নেভিগেট হবে যাতে টোস্ট দেখা যায়
      } else {
        throw new Error("Failed to add");
      }
    } catch (error) {
      console.error("API Error:", error);
      // এরর টোস্ট
      toast.error("Failed to add department.", { id: loadingToast });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "1890px",
        height: "1024px",
        margin: "0 auto",
        boxSizing: "border-box",
        backgroundColor: "#f4f6f9",
      }}
    >
      {/* টোস্ট কন্টেইনার অবশ্যই রেন্ডার করতে হবে */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <Header />
      <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: "40px", overflowY: "auto" }}>
          
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            
            {/* Back Button Section */}
            <div style={{ marginBottom: "20px" }}>
              <Link to="/admin-department" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                >
                  ← Back
                </button>
              </Link>
            </div>

            {/* Form Card */}
            <form 
              onSubmit={handleSubmit}
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                padding: "40px",
                border: "1px solid #eee"
              }}
            >
              <div style={{ marginBottom: "30px" }}>
                <h2 style={{ fontSize: "22px", color: "#333", fontWeight: "600", borderBottom: "2px solid #28a745", paddingBottom: "10px", display: "inline-block" }}>
                  Add Department
                </h2>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label 
                  htmlFor="name" 
                  style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}
                >
                  Department Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter department name..."
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                    outline: "none",
                  }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginTop: "30px" }}>
                <button 
                  type="submit" 
                  style={{
                    width: "150px", 
                    padding: "12px",
                    backgroundColor: "#28a745", 
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(40, 167, 69, 0.3)",
                    transition: "background 0.3s ease"
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#218838")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddDepartment;