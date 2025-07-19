import React from 'react';

const Header = () => {
  return (
    <div>
      <header
        style={{
          backgroundColor: '#0fb5f7',
          color: '#fff',
          padding: '15px',
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px'
        }}
      >
        <i className="bi bi-people" style={{ fontSize: "45px", color: "#07f747" }}></i>
        <h1 style={{ margin: 0, fontSize: "36px", fontWeight: "600" }}>Employee Management System</h1>
      </header>
    </div>
  );
};

export default Header;
