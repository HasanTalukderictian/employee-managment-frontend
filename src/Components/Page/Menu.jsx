import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Menu = ({ darkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('authToken');

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok || response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/');
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      navigate('/admin-login');
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: 'bi-speedometer2', route: '/admin-home' },
    { name: 'Employee', icon: 'bi-people', route: '/admin-employee' },
    { name: 'Department', icon: 'bi-diagram-3', route: '/admin-department' },
    { name: 'Designation', icon: 'bi-person-badge', route: '/admin-desgination' },
    { name: 'Salary', icon: 'bi-currency-dollar', route: '/admin-salary' },
    { name: 'Leave', icon: 'bi-calendar-check', route: '/admin-leave' },
    { name: 'Users', icon: 'bi-person-lines-fill', route: '/admin-users' },
    { name: 'Attendance', icon: 'bi-calendar-check-fill', route: '/admin-attendance' },
    { name: 'Task', icon: 'bi-clipboard-check', route: '/admin-task' },
    { name: 'Logout', icon: 'bi-box-arrow-right', isLogout: true },
  ];

  // Theme-based colors
  const menuBg = darkMode ? 'rgba(30, 41, 59, 0.95)' : '#ffffff';
  const textColor = darkMode ? '#e2e8f0' : '#1e293b';
  const activeBg = 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
  const shadowColor = darkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)';

  return (
    <nav
      style={{
        width: '280px',
        minHeight: '100vh',
        background: menuBg,
        padding: '20px 15px',
        boxShadow: `4px 0 15px ${shadowColor}`,
        transition: 'all 0.3s ease',
        borderRight: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
        zIndex: 100,
      }}
    >
      <div className="mb-4 px-3 py-2 text-center">
        <h4 style={{ color: '#10b981', fontWeight: '800', letterSpacing: '1px' }}>MANAGEMENT</h4>
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #10b981, transparent)', marginTop: '5px' }}></div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.route;
          const isHovered = hoveredItem === item.name;

          return (
            <li
              key={item.name}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={item.isLogout ? handleLogout : () => navigate(item.route)}
              style={{
                marginBottom: '8px',
                padding: '12px 18px',
                cursor: 'pointer',
                borderRadius: '12px',
                background: isActive ? activeBg : isHovered ? (darkMode ? '#334155' : '#f1f5f9') : 'transparent',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered && !isActive ? 'translateX(5px)' : 'none',
                boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
              }}
            >
              <i
                className={`bi ${item.icon}`}
                style={{
                  fontSize: '22px',
                  marginRight: '15px',
                  color: isActive ? '#fff' : (item.isLogout ? '#ef4444' : '#10b981'),
                  transition: 'transform 0.3s ease',
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                }}
              ></i>

              <span
                style={{
                  fontSize: '17px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#fff' : textColor,
                  transition: 'all 0.3s ease',
                }}
              >
                {item.name}
              </span>

              {isActive && (
                <div style={{ marginLeft: 'auto', width: '6px', height: '6px', background: '#fff', borderRadius: '50%' }}></div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Menu;