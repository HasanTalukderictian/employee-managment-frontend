import React from 'react'

const Menu = () => {
  return (
    <nav style={{ backgroundColor: '#333', color: '#fff', minHeight: '100vh', width: '200px', padding: '10px' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>Home</li>
        <li>Profile</li>
        <li>Settings</li>
        <li>Logout</li>
      </ul>
    </nav>
  )
}

export default Menu
