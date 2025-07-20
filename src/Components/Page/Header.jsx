import React from 'react';

const Header = () => {
  return (
    <div>
      <header
        style={{
          background: 'linear-gradient(to bottom, #9999ff 0%, #ff99cc 100%)',
          color: '#fff',
          padding: '8px',
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
           borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          boxShadow: '0 4px 6px gray'
        }}
      >
        <i className="bi bi-people" style={{ fontSize: "45px", color: "#07f747" }}></i>
        <h1 style={{ margin: 0, fontSize: "36px", fontWeight: "600", fontFamily:'sans-serif' }}>Employee Management System</h1>
      </header>
    </div>
  );
};

export default Header;
