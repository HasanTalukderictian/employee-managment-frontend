import React from 'react';

const Footer = ({ darkMode }) => {
  const currentYear = new Date().getFullYear();

  // Theme based styles
  const footerBg = darkMode ? '#0f172a' : '#ffffff';
  const textColor = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#1e293b' : '#e2e8f0';

  return (
    <footer
      style={{
        background: footerBg,
        color: textColor,
        padding: '30px 40px',
        fontSize: '16px',
        borderTop: `1px solid ${borderColor}`,
        width: '100%', // FIXED: changed from 1890px to 100%
        margin: '0 auto',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* Left Side: Copyright Info */}
        <div style={{ minWidth: '250px' }}>
          <p style={{ margin: 0, fontWeight: '500' }}>
            © {currentYear} <span style={{ color: '#10b981', fontWeight: '700' }}>Employee Management System</span>. All rights reserved.
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
            Providing efficient solutions for workplace productivity.
          </p>
        </div>

        {/* Middle Section: Developer Credit */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0 }}>
            Design & Development by{' '}
            <a
              href="https://hasan-portfilo.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                color: '#10b981', 
                textDecoration: 'none', 
                fontWeight: '700',
                borderBottom: '2px solid transparent',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.borderBottom = '2px solid #10b981'}
              onMouseLeave={(e) => e.target.style.borderBottom = '2px solid transparent'}
            >
              Hasan Talukder
            </a>
          </p>
        </div>

        {/* Right Side: Quick Links or Icons */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{ color: textColor, fontSize: '20px', transition: 'color 0.3s' }} 
             onMouseEnter={(e) => e.target.style.color = '#10b981'} 
             onMouseLeave={(e) => e.target.style.color = textColor}>
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" style={{ color: textColor, fontSize: '20px', transition: 'color 0.3s' }}
             onMouseEnter={(e) => e.target.style.color = '#10b981'} 
             onMouseLeave={(e) => e.target.style.color = textColor}>
            <i className="bi bi-linkedin"></i>
          </a>
          <a href="#" style={{ color: textColor, fontSize: '20px', transition: 'color 0.3s' }}
             onMouseEnter={(e) => e.target.style.color = '#10b981'} 
             onMouseLeave={(e) => e.target.style.color = textColor}>
            <i className="bi bi-github"></i>
          </a>
          <a href="#" style={{ color: textColor, fontSize: '20px', transition: 'color 0.3s' }}
             onMouseEnter={(e) => e.target.style.color = '#10b981'} 
             onMouseLeave={(e) => e.target.style.color = textColor}>
            <i className="bi bi-globe"></i>
          </a>
        </div>
      </div>

      {/* Subtle bottom line */}
      <div style={{ 
        marginTop: '20px', 
        height: '1px', 
        background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)`,
        opacity: 0.5 
      }}></div>
    </footer>
  );
};

export default Footer;