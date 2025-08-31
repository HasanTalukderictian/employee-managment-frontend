import { useEffect, useState } from 'react';

const Header = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    console.log('storedRole from localStorage:', storedRole);
    setRole(storedRole);
  }, []);

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
          boxShadow: '0 4px 6px gray',
        }}
      >
        {/* Left section: Icon + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="bi bi-people text-warning" style={{ fontSize: "40px" }}></i>
          <h1 style={{ margin: 0, fontSize: "30px", fontWeight: "600", fontFamily: 'sans-serif' }}>
            Employee Management System
          </h1>
        </div>

        {/* Right section: Profile Image + Notification Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <i
            className="bi bi-bell-fill"
            style={{ fontSize: "28px", color: "#ffffff", cursor: 'pointer' }}
          ></i>

          {/* 👇 Dynamic role text */}
          <p style={{ margin: 0 }}>
            {role ? `Welcome ${role}` : "Welcome"}
          </p>

          <img
            src="https://i.ibb.co.com/jvFR7NXv/IMG-2688.jpg"
            alt="Profile"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid white',
            }}
          />
        </div>
      </header>
    </div>
  );
};

export default Header;
