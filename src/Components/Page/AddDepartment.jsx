import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"; 
import Header from "./Header"; 
import Menu from "./Menu"; 

const AddDepartment = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // থিম ডাইনামিক কালারস
  const theme = {
    bg: darkMode ? '#0f172a' : '#f4f6f9',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f8fafc' : '#333',
    label: darkMode ? '#94a3b8' : '#555',
    border: darkMode ? '#334155' : '#eee',
    inputBg: darkMode ? '#0f172a' : '#ffffff',
    inputBorder: darkMode ? '#334155' : '#ccc',
    backBtnBg: darkMode ? '#1e293b' : '#fff',
    backBtnText: darkMode ? '#f8fafc' : '#333',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

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
        toast.success("Department added successfully!", { id: loadingToast });
        setName("");
        setTimeout(() => navigate("/admin-department"), 1500); 
      } else {
        throw new Error("Failed to add");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to add department.", { id: loadingToast });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        margin: "0 auto",
        boxSizing: "border-box",
        backgroundColor: theme.bg,
        transition: 'all 0.3s ease'
      }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        
        <main style={{ 
          flexGrow: 1, 
          padding: "30px", 
          overflowY: "auto",
          transition: 'all 0.4s ease'
        }}>
          
          <div style={{ maxWidth: "900px", margin: "0 auto", width: "100%" }}>
            
            

            {/* Form Card */}
            <form 
              onSubmit={handleSubmit}
              style={{
                background: theme.cardBg,
                borderRadius: "20px",
                boxShadow: darkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 25px rgba(0,0,0,0.05)",
                padding: "40px",
                border: `1px solid ${theme.border}`,
                transition: 'all 0.3s ease'
              }}
            >

               <Link to="/admin-department" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                    backgroundColor: theme.backBtnBg,
                    color: theme.backBtnText,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#334155" : "#f8fafc"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.backBtnBg}
                >
                  <i className="bi bi-arrow-left"></i> Back to List
                </button>
              </Link>
              <div style={{ marginBottom: "35px" }}>
                <h2 style={{ 
                  fontSize: "24px", 
                  color: theme.text, 
                  fontWeight: "700", 
                  borderBottom: "3px solid #10b981", 
                  paddingBottom: "10px", 
                  display: "inline-block" 
                }}>
                  Add New Department
                </h2>
                <p style={{ color: theme.label, marginTop: "10px", fontSize: "14px" }}>Create a new organizational category for your employees.</p>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label 
                  htmlFor="name" 
                  style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: theme.label, fontSize: "15px" }}
                >
                  Department Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g. Human Resources, Engineering..."
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    border: `1px solid ${theme.inputBorder}`,
                    background: theme.inputBg,
                    color: theme.text,
                    fontSize: "16px",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s ease"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#10b981"}
                  onBlur={(e) => e.target.style.borderColor = theme.inputBorder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginTop: "40px", textAlign: "right" }}>
                <button 
                  type="submit" 
                  style={{
                    width: "100%",
                    maxWidth: "180px", 
                    padding: "14px",
                    backgroundColor: "#10b981", 
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 10px 15px rgba(16, 185, 129, 0.2)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
                >
                  Save Department
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