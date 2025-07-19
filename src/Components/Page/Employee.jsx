import React from 'react'
import Header from './Header'
import Menu from './Menu'
import Footer from './Footer'

const Employee = () => {
  return (
   <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '1840px',
        height: '1024px',
        margin: '0 auto', // centers horizontally
        border: '1px solid #ccc', // optional: for visual debug
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

export default Employee
