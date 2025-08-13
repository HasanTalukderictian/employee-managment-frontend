import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Retrieve token from localStorage
  const token = localStorage.getItem('authToken');

  // Logout handler function
  const handleLogout = async () => {
    try {
      console.log("Logging out with token:", token);

      const response = await fetch(`${BASE_URL}/api/admin/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log("Logout response:", data);

      if (response.ok) {
        // Clear token from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAdminLoggedIn');
        // Navigate to login page
        navigate('/');
      } else {
        console.error('Logout failed', data);
        // Navigate to login page even if token is invalid
        if (response.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('isAdminLoggedIn');
          navigate('/admin-login');
        }
      }
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAdminLoggedIn');
      navigate('/admin-login');
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: 'bi-speedometer2', route: '/admin-home' },
    { name: 'Employee', icon: 'bi-people', route: '/admin-employee' },
    { name: 'Department', icon: 'bi-diagram-3', route: '/admin-department' },
    { name: 'Desgination', icon: 'bi-person-badge', route: '/admin-desgination' },
    { name: 'Salary', icon: 'bi-currency-dollar', route: '/admin-salary' },
    { name: 'Leave', icon: 'bi-calendar-check', route: '/admin-leave' },
    { name: 'Users', icon: 'bi-person-lines-fill', route: '/admin-users' },
    { name: 'Attendance', icon: 'bi-calendar-check-fill', route: '/admin-attendance' },
    { name: 'Task', icon: 'bi-clipboard-check', route: '/admin-task' },
    { name: 'Logout', icon: 'bi-box-arrow-right' },
  ];

  return (
    <nav
      style={{
    backgroundColor: '#3a423c',
    color: '#fff',
    minHeight: '100vh',
    paddingLeft: '5px',
    width: '280px',
    padding: '10px',
    boxShadow: '4px 0 10px rgba(0, 0, 0, 0.4)' // ← Shadow on right side
  }}
    >
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map((item) => (
          <li
            key={item.name}
            onClick={item.name === 'Logout' ? handleLogout : undefined}
            style={{
              fontSize: '23px',
              padding: '10px 8px',
              cursor: 'pointer',
              backgroundColor: location.pathname === item.route ? '#555' : 'transparent',
              borderRadius: '4px',
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {item.name === 'Logout' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  color: '#fff',
                  textDecoration: 'none',
                  width: '100%'
                }}
              >
                <i className={`bi ${item.icon}`} style={{ fontSize: '30px', color: '#07f747' }}></i>
                {item.name}
              </div>
            ) : (
              <Link
                to={item.route}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#fff',
                  textDecoration: 'none',
                  width: '100%'
                }}
              >
                <i className={`bi ${item.icon}`} style={{ fontSize: '30px', color: '#07f747' }}></i>
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
