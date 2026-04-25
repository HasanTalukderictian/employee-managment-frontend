import React, { useState, useEffect } from "react";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import { QRCodeSVG } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";
import toast, { Toaster } from "react-hot-toast";

const Attendance = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [scanning, setScanning] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const today = new Date().toISOString().split("T")[0];
  const qrToken = `ATTENDANCE_${today}`;

  const theme = {
    bg: darkMode ? "#0f172a" : "#f4f7f6",
    cardBg: darkMode ? "#1e293b" : "#ffffff",
    text: darkMode ? "#f8fafc" : "#2c3e50",
    border: darkMode ? "#334155" : "#eee",
    accent: "#3b82f6",
    muted: darkMode ? "#94a3b8" : "#64748b",
  };

  // এপিআই-তে হাজিরা পাঠানোর ফাংশন
  const markAttendance = async (decodedText) => {
    const employeeId = localStorage.getItem("employeeId");
    try {
      const response = await fetch(`${BASE_URL}/api/scan-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeId,
          qr_token: decodedText,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Attendance successful!");
      } else {
        toast.error(data.message || "Invalid QR Code");
      }
    } catch (error) {
      toast.error("Server connection failed!");
    }
  };

  // স্ক্যানার সেটআপ
  useEffect(() => {
    let scanner = null;
    if (scanning && role !== "admin") {
      scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        aspectRatio: 1.0,
      });

      scanner.render(
        (decodedText) => {
          scanner.clear(); // স্ক্যান সফল হলে ক্যামেরা বন্ধ করবে
          setScanning(false);
          markAttendance(decodedText);
        },
        (error) => {
          // স্ক্যানিং চলাকালীন এরর ইগনোর করুন
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch((error) => console.error("Failed to clear scanner", error));
      }
    };
  }, [scanning, role]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: theme.bg,
        transition: "0.3s ease",
        color: theme.text,
      }}
    >
      <Toaster position="top-right" />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

        <main style={{ flexGrow: 1, padding: "30px", overflowY: "auto" }}>
          <div
            style={{
              background: theme.cardBg,
              borderRadius: "20px",
              padding: "40px",
              border: `1px solid ${theme.border}`,
              boxShadow: darkMode ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.05)",
              minHeight: "80vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2 style={{ fontWeight: "800", marginBottom: "10px" }}>Employee Attendance</h2>
            <p style={{ color: theme.muted, marginBottom: "40px" }}>
              {role === "admin" ? "Display this QR for check-in" : "Scan to mark your attendance"}
            </p>

            {role === "admin" ? (
              /* --- ADMIN: QR DISPLAY --- */
              <div style={{ background: "#fff", padding: "25px", borderRadius: "20px", border: `1px solid ${theme.border}` }}>
                <QRCodeSVG value={qrToken} size={250} />
                <div style={{ marginTop: "15px", textAlign: "center", color: "#333" }}>
                  <strong>{new Date().toDateString()}</strong>
                </div>
              </div>
            ) : (
              /* --- EMPLOYEE: SCANNER --- */
              <div style={{ width: "100%", maxWidth: "400px" }}>
                {!scanning ? (
                  <button
                    onClick={() => setScanning(true)}
                    style={{
                      width: "100%",
                      padding: "50px 20px",
                      borderRadius: "20px",
                      border: `2px dashed ${theme.accent}`,
                      background: "transparent",
                      color: theme.text,
                      cursor: "pointer",
                    }}
                  >
                    <i className="bi bi-camera" style={{ fontSize: "40px", color: theme.accent }}></i>
                    <h4 className="mt-3">Tap to Open Scanner</h4>
                  </button>
                ) : (
                  <div style={{ borderRadius: "20px", overflow: "hidden", border: `2px solid ${theme.accent}`, background: "#000" }}>
                    <div id="reader"></div>
                    <button
                      className="btn btn-danger w-100 rounded-0"
                      onClick={() => setScanning(false)}
                    >
                      Close Camera
                    </button>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: "50px", fontSize: "14px", color: theme.muted }}>
              <i className="bi bi-clock-history me-2"></i>
              Office Hours: 9:00 AM - 6:00 PM
            </div>
          </div>
        </main>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Attendance;