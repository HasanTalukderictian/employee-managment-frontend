import React, { useEffect, useState, useRef } from 'react';
import { IoMdSunny, IoMdMoon } from "react-icons/io";

const Header = ({ darkMode, setDarkMode }) => {
  const [role, setRole] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
    const BASE_URL = import.meta.env.VITE_BASE_URL;

  // =========================
  // FETCH NOTIFICATIONS
  // =========================

  console.log("EMPLOYEE ID:", localStorage.getItem("employee_id"));
  const fetchNotifications = async (empId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/get-notification/${empId}`);
      const result = await res.json();

      const list = result.data || [];

      setNotifications(list);
      setUnreadCount(list.filter(n => n.read_at === null).length);

    } catch (err) {
      console.error("Notification Fetch Error:", err);
    }
  };

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const employeeId = localStorage.getItem("employee_id"); // 🔥 MUST BE employee.id

    setRole(storedRole);

    console.log("employee_id:", employeeId);

    if (employeeId) {
      fetchNotifications(employeeId);
    }
  }, []);

  // =========================
  // CLOSE DROPDOWN OUTSIDE CLICK
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =========================
  // THEME
  // =========================
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const textColor = darkMode ? '#f8fafc' : '#1e293b';

  // =========================
  // UI
  // =========================
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 40px',
        borderBottom: `1px solid ${borderColor}`,
        background: darkMode ? '#1e293b' : '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >

      {/* LEFT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <h1 style={{ fontSize: '20px', color: '#10b981', margin: 0 }}>
          HASAN'S EMS
        </h1>
      </div>

      {/* RIGHT */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

        {/* DARK MODE */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          style={{ cursor: 'pointer' }}
        >
          {darkMode
            ? <IoMdSunny color="#fbbf24" size={22} />
            : <IoMdMoon color="#6366f1" size={22} />
          }
        </div>

        {/* NOTIFICATION */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>

          {/* BELL */}
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: `1px solid ${borderColor}`,
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <i className="bi bi-bell" style={{ fontSize: "20px", color: "#10b981" }} />

            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: 'bold'
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>

          {/* DROPDOWN */}
          {showDropdown && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '55px',
                width: '320px',
                background: darkMode ? '#1e293b' : '#fff',
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                maxHeight: '400px',
                overflowY: 'auto'
              }}
            >

              <div style={{
                padding: '12px',
                fontWeight: 'bold',
                borderBottom: `1px solid ${borderColor}`,
                color: textColor
              }}>
                Notifications
              </div>

              {notifications.length === 0 ? (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#94a3b8'
                }}>
                  No notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '12px',
                      borderBottom: `1px solid ${borderColor}`,
                      background: n.read_at
                        ? 'transparent'
                        : (darkMode ? '#2d3748' : '#f0fff4')
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 600, color: textColor }}>
                      {n.data?.message}
                    </div>

                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Month: {n.data?.month} | Target: {n.data?.target_value}
                    </div>

                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="text-end">
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: textColor }}>
              Hello
            </p>
            <small style={{ color: '#10b981' }}>
              {role || 'User'}
            </small>
          </div>

          <img
            src="https://i.ibb.co.com/jvFR7NXv/IMG-2688.jpg"
            alt="Profile"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              objectFit: 'cover'
            }}
          />
        </div>

      </div>
    </header>
  );
};

export default Header;