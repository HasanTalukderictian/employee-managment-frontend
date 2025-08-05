import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: '#092b12',
        color: '#fff',
        textAlign: 'center',
        padding: '14px',
        fontSize: '20px',
        lineHeight: '1.6',
      }}
    >
      <p style={{ margin: 0 }}>
        © {currentYear} Employee Management System. All rights reserved.
        <br />
        Design and Development by{' '}
        <a
          href="https://hasan-portfilo.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#b3e5fc', textDecoration: 'none' }}
        >
          Hasan Talukder
        </a>
      </p>
    </footer>
  );
};

export default Footer;
