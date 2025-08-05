import React from 'react';

const Header = () => {
  return (
    <div>
      <header
        style={{
          background: '#092b12',
          color: '#fff',
          padding: '8px 20px',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          boxShadow: '0 4px 6px gray',
        }}
      >
        {/* Left section: Icon + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="bi bi-people" style={{ fontSize: "45px", color: "#07f747" }}></i>
          <h1 style={{ margin: 0, fontSize: "36px", fontWeight: "600", fontFamily: 'sans-serif' }}>
            Employee Management System
          </h1>
        </div>

        {/* Right section: Notification icon */}
        <div>
          <i className="bi bi-bell-fill" style={{ fontSize: "28px", color: "#ffffff", cursor: 'pointer' }}></i>
        </div>
      </header>
    </div>
  );
};

export default Header;
