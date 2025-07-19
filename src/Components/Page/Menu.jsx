import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  const [active, setActive] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: 'bi-speedometer2', route: '/admin-dashboard' },
    { name: 'Employee', icon: 'bi-people', route: '/admin-employee' },
    { name: 'Department', icon: 'bi-diagram-3', route: '/admin-department' },
    { name: 'Desgination', icon: 'bi-person-badge', route: '/admin-desgination' },
    { name: 'Salary', icon: 'bi-currency-dollar', route: '/admin-salary' },
    { name: 'Leave', icon: 'bi-calendar-check', route: '/admin-leave' },
    { name: 'Users', icon: 'bi-person-lines-fill', route: '/admin-users' },
    { name: 'Logout', icon: 'bi-box-arrow-right', route: '/logout' },
  ];

  return (
    <nav style={{
      backgroundColor: '#333',
      color: '#fff',
      minHeight: '100vh',
      paddingLeft: '5px',
      width: '280px',
      padding: '10px'
    }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map((item) => (
          <li
            key={item.name}
            onClick={() => setActive(item.name)}
            style={{
              fontSize: '23px',
              padding: '10px 8px',
              cursor: 'pointer',
              backgroundColor: active === item.name ? '#555' : 'transparent',
              borderRadius: '4px',
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Link to={item.route} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', textDecoration: 'none', width: '100%' }}>
              <i className={`bi ${item.icon}`} style={{ fontSize: "30px", color: "#07f747" }}></i>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
