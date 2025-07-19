import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#0fb5f7', color: '#fff', textAlign: 'center', padding: '10px' }}>
      <p>© {currentYear} Employee Management System. All rights reserved.Desgin and Development <span className='text-secondary'>Hasan Talukder</span></p>
    </footer>
  );
};

export default Footer;
