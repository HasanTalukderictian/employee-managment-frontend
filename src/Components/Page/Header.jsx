import { useEffect, useState } from 'react';

const Header = ({ darkMode }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
  }, []);

  // Theme based styles
  const headerBg = darkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.8)';
  const textColor = darkMode ? '#f8fafc' : '#1e293b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';

  return (
    <header
      style={{
        background: headerBg,
        backdropFilter: 'blur(10px)',
        color: textColor,
        padding: '12px 40px',
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 15px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '1890px', // আপনার ফিক্সড উইডথ
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
    >
      {/* Left section: Logo + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div
          className="shadow-sm d-flex justify-content-center align-items-center"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "14px",
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 8px 15px rgba(16, 185, 129, 0.2)',
            transition: 'transform 0.3s ease'
          }}
        >
          <i
            className="bi bi-person-workspace"
            style={{ fontSize: "24px", color: "#fff" }}
          ></i>
        </div>

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: "800",
              letterSpacing: '-0.5px',
              color: "#10b981",
              textTransform: 'uppercase'
            }}
          >
            Hasan's <span style={{ color: darkMode ? '#94a3b8' : '#64748b', fontWeight: '400' }}>EMS</span>
          </h1>
          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
            CRM Management System
          </p>
        </div>
      </div>

      {/* Right section: Tools + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* Search Bar - Optional addition for attractiveness */}
        <div className="d-none d-xl-flex align-items-center px-3 py-2 rounded-pill" 
             style={{ background: darkMode ? '#1e293b' : '#f1f5f9', border: `1px solid ${borderColor}` }}>
          <i className="bi bi-search" style={{ color: '#94a3b8' }}></i>
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ background: 'none', border: 'none', outline: 'none', marginLeft: '10px', fontSize: '14px', color: textColor }}
          />
        </div>

        {/* Notification */}
        <div className="position-relative" style={{ cursor: 'pointer' }}>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: darkMode ? '#1e293b' : '#fff',
              border: `1px solid ${borderColor}`,
              transition: 'all 0.3s ease'
            }}
          >
            <i className="bi bi-bell" style={{ fontSize: "20px", color: "#10b981" }}></i>
          </div>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                style={{ fontSize: '10px', padding: '4px 6px', border: '2px solid white' }}>
            3
          </span>
        </div>

        {/* User Profile info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '15px', borderLeft: `1px solid ${borderColor}` }}>
          <div className="text-end">
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: textColor }}>Hasan Talukder</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#10b981', fontWeight: '600' }}>{role || 'Administrator'}</p>
          </div>
          <div style={{ position: 'relative' }}>
            <img
              src="https://i.ibb.co.com/jvFR7NXv/IMG-2688.jpg"
              alt="Profile"
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '14px',
                objectFit: 'cover',
                border: `2px solid #10b981`,
                padding: '2px'
              }}
            />
            <div style={{
              width: '12px', height: '12px', background: '#10b981', 
              borderRadius: '50%', position: 'absolute', bottom: '-2px', right: '-2px',
              border: '2px solid white'
            }}></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;