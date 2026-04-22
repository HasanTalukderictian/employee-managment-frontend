import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Menu = ({ darkMode, isExpanded, setIsExpanded }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [role, setRole] = useState(null); // রোল স্টেট

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে রোল সেট করা
    const userRole = localStorage.getItem('userRole');
    setRole(userRole);
  }, []);

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
        localStorage.clear(); // সব ডেটা ক্লিয়ার করা ভালো
        navigate('/');
      }
    } catch (error) {
      localStorage.clear();
      navigate('/admin-login');
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: 'bi-speedometer2', route: '/admin-home' },
    { name: 'Employee', icon: 'bi-people', route: '/admin-employee', adminOnly: true },
    { name: 'Department', icon: 'bi-diagram-3', route: '/admin-department', adminOnly: true }, // adminOnly flag
    { name: 'Designation', icon: 'bi-person-badge', route: '/admin-desgination', adminOnly: true }, // adminOnly flag
    { name: 'Salary', icon: 'bi-currency-dollar', route: '/admin-salary' },
    { name: 'Leave', icon: 'bi-calendar-check', route: '/admin-leave' },
    { name: 'Users', icon: 'bi-person-lines-fill', route: '/admin-users', adminOnly: true }, // adminOnly flag
    { name: 'Target', icon: 'bi-clipboard-check', route: '/admin-target' },
    { name: 'Task', icon: 'bi-clipboard-check', route: '/admin-task' },
    { name: 'Logout', icon: 'bi-box-arrow-right', isLogout: true },
  ];

  // ফিল্টার করা মেনু: যদি রোল এডমিন না হয়, তবে adminOnly আইটেমগুলো বাদ যাবে
  const visibleMenuItems = menuItems.filter(item => {
    if (item.adminOnly && role !== 'admin') {
      return false;
    }
    return true;
  });

  const menuBg = darkMode ? 'rgba(30, 41, 59, 0.95)' : '#ffffff';
  const textColor = darkMode ? '#e2e8f0' : '#1e293b';
  const activeBg = 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
  const shadowColor = darkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)';

  return (
    <nav
      style={{
        width: isExpanded ? '280px' : '80px',
        minHeight: '100vh',
        background: menuBg,
        padding: isExpanded ? '20px 15px' : '20px 10px',
        boxShadow: `4px 0 15px ${shadowColor}`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRight: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
        zIndex: 100,
        position: 'sticky',
        top: 0,
        overflow: 'hidden'
      }}
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: 'pointer',
          textAlign: 'center',
          marginBottom: '30px',
          color: '#10b981',
          fontSize: '24px'
        }}
      >
        <i className={`bi ${isExpanded ? 'bi-list' : 'bi-text-indent-left'}`}></i>
      </div>

      {isExpanded && (
        <div className="mb-4 px-3 py-2 text-center" style={{ animation: 'fadeIn 0.5s' }}>
          <h4 style={{ color: '#10b981', fontWeight: '800', letterSpacing: '1px', margin: 0, fontSize: '18px' }}>
            {role === 'admin' ? 'ADMIN PANEL' : 'USER PANEL'}
          </h4>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #10b981, transparent)', marginTop: '5px' }}></div>
        </div>
      )}

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {visibleMenuItems.map((item) => { // visibleMenuItems ব্যবহার করা হয়েছে
          const isActive = location.pathname === item.route;
          const isHovered = hoveredItem === item.name;

          return (
            <li
              key={item.name}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={item.isLogout ? handleLogout : () => navigate(item.route)}
              title={!isExpanded ? item.name : ""}
              style={{
                marginBottom: '8px',
                padding: '12px',
                justifyContent: isExpanded ? 'flex-start' : 'center',
                cursor: 'pointer',
                borderRadius: '12px',
                background: isActive ? activeBg : isHovered ? (darkMode ? '#334155' : '#f1f5f9') : 'transparent',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
              }}
            >
              <i
                className={`bi ${item.icon}`}
                style={{
                  fontSize: '22px',
                  marginRight: isExpanded ? '15px' : '0',
                  color: isActive ? '#fff' : (item.isLogout ? '#ef4444' : '#10b981'),
                  transition: 'margin 0.3s ease',
                }}
              ></i>

              {isExpanded && (
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#fff' : textColor,
                    whiteSpace: 'nowrap',
                    opacity: isExpanded ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Menu;