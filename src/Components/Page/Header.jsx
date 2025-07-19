import React from 'react';

const Header = () => {
  return (
    <div>
      <header
        style={{
          backgroundColor: '#0fb5f7',
          color: '#fff',
          padding: '10px',
          cursor: 'pointer',
          userSelect: 'none' // prevents text selection cursor
        }}
      >
        <h1>My Dashboard</h1>
      </header>
    </div>
  );
};

export default Header;
