import React from 'react'
import Header from './Header'
import Menu from './Menu'
import Footer from './Footer'

const Leave = () => {
  return (
    <div
      style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // ✅ Use minHeight instead of fixed height
          width: '1890px',
          margin: '0 auto',
          border: '1px solid #ccc',
          boxSizing: 'border-box',
        }}
    >
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
          <h2>Welcome to the Employee</h2>
          <p>Your content here...</p>
        </main>
      </div>
      <Footer />
      </div>   
  )
}

export default Leave
