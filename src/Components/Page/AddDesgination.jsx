import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import Menu from "./Menu";

const AddDesgination = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // থিম ডাইনামিক কালারস
  const theme = {
    bg: darkMode ? '#0f172a' : '#f8f9fa',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f8fafc' : '#2d3436',
    labelText: darkMode ? '#94a3b8' : '#555',
    border: darkMode ? '#334155' : '#eee',
    inputBg: darkMode ? '#0f172a' : '#ffffff',
    inputBorder: darkMode ? '#334155' : '#ced4da',
    btnBackBg: darkMode ? '#1e293b' : '#fff',
    btnBackText: darkMode ? '#f8fafc' : '#333'
  };

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
      <Toaster position="top-right" reverseOrder={false} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: '100%',
          minHeight: '100vh',
          margin: "0 auto",
          boxSizing: "border-box",
          backgroundColor: theme.bg,
          transition: "all 0.3s ease"
        }}
      >
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

          <main style={{
            flexGrow: 1,
            padding: "20px",
            overflowY: "auto",
            transition: "all 0.3s ease"
          }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>




              {/* Form Card */}
              <form
                onSubmit={handleSubmit}
                style={{
                  background: theme.cardBg,
                  borderRadius: "16px",
                  boxShadow: darkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.08)",
                  padding: "clamp(20px, 5vw, 40px)",
                  border: `1px solid ${theme.border}`,
                  transition: "all 0.3s ease",
                  display: "flex",          // Flexbox যোগ করা হয়েছে
                  flexDirection: "column",   // কলাম অনুযায়ী সাজানো
                  alignItems: "flex-start"   // সবকিছু একদম বাম দিক থেকে শুরু হবে
                }}
              >
                {/* Back Button Container */}
                <Link to="/admin-desgination" style={{ textDecoration: 'none', marginBottom: "20px" }}>
                  <button
                    style={{
                      padding: "10px 20px",
                      fontSize: "15px",
                      backgroundColor: theme.btnBackBg,
                      border: `1px solid ${theme.border}`,
                      borderRadius: "8px",
                      boxShadow: darkMode ? "0 2px 4px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.05)",
                      color: theme.btnBackText,
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center"
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#334155" : "#f1f1f1")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = theme.btnBackBg)}
                  >
                    <i className="bi bi-arrow-left me-2"></i> Back to List
                  </button>
                </Link>

                {/* Heading Container */}
                <div style={{
                  marginBottom: "30px",
                  borderBottom: `2px solid ${darkMode ? '#22c55e' : '#28a745'}`,
                  paddingBottom: "10px",
                  width: "fit-content" // বর্ডারটি শুধু লেখার নিচেই থাকবে
                }}>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: theme.text, margin: 0 }}>
                    Add New Designation
                  </h2>
                </div>

                {/* Input Field - Width 100% রাখা হয়েছে */}
                <div className="mb-4" style={{ width: "100%" }}>
                  <label
                    htmlFor="name"
                    style={{ display: "block", marginBottom: "10px", fontWeight: "600", color: theme.labelText, fontSize: "16px", textAlign: "left" }}
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
                      border: `1px solid ${theme.inputBorder}`,
                      background: theme.inputBg,
                      color: theme.text,
                      fontSize: "16px",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#28a745")}
                    onBlur={(e) => (e.target.style.borderColor = theme.inputBorder)}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div style={{ marginTop: "10px" }}>
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