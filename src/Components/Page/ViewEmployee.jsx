import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';

const ViewEmployee = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Theme Config
  const theme = {
    bg: darkMode ? "#0f172a" : "#f1f5f9",
    cardBg: darkMode ? "#1e293b" : "#ffffff",
    boxBg: darkMode ? "#334155" : "#f8fafc",
    textMain: darkMode ? "#f8fafc" : "#1e293b",
    textMuted: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#e2e8f0"
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/view-emplyee/${id}`);
        if (!response.ok) throw new Error('Failed to fetch employee data');
        const result = await response.json();
        setEmployee(result.data || result.employee);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, BASE_URL]);

  // Modern Styles - Dynamic with Theme
  const detailBoxStyle = {
    padding: '15px 20px',
    borderRadius: '15px',
    background: theme.boxBg,
    border: `1px solid ${theme.border}`,
    height: '100%',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    fontSize: '11px',
    color: theme.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: '4px',
    display: 'block',
    letterSpacing: '0.8px'
  };

  const valueStyle = {
    fontSize: '15px',
    color: theme.textMain,
    fontWeight: '600',
    wordBreak: 'break-word'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', background: theme.bg, transition: '0.3s' }}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        
        <main style={{ flexGrow: 1, padding: "25px", overflowY: 'auto' }}>
          <div style={{ 
            background: theme.cardBg, 
            borderRadius: "24px", 
            boxShadow: darkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 40px rgba(0,0,0,0.03)", 
            padding: "35px", 
            minHeight: '100%',
            border: `1px solid ${theme.border}`,
            transition: '0.3s'
          }}>
            
            {/* Action Bar */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3 border-bottom pb-4" style={{ borderColor: theme.border }}>
              <button onClick={() => navigate(-1)} className="btn shadow-sm" 
                style={{ borderRadius: '12px', background: theme.cardBg, border: `1px solid ${theme.border}`, fontWeight: '600', color: theme.textMain, padding: '8px 20px' }}>
                <i className="bi bi-arrow-left me-2"></i>Back
              </button>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: theme.textMain, margin: 0 }}>Employee Profile</h2>
              <button onClick={() => window.print()} className="btn btn-primary shadow-sm" style={{ borderRadius: '12px', fontWeight: '600', padding: '8px 20px' }}>
                <i className="bi bi-printer me-2"></i>Print Profile
              </button>
            </div>

            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3" style={{ color: theme.textMuted }}>Loading Profile...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger border-0 shadow-sm">{error}</div>
            ) : employee ? (
              <div className="row g-4">
                
                {/* Left Side: Profile Identity Card */}
                <div className="col-12 col-lg-4">
                  <div style={{ textAlign: 'center', background: theme.boxBg, borderRadius: '25px', padding: '40px 30px', border: `1px solid ${theme.border}`, height: '100%' }}>
                    <div className="mb-4 position-relative d-inline-block">
                      {employee.profile_picture ? (
                        <img 
                          src={`${BASE_URL}/${employee.profile_picture}`} 
                          alt="Profile" 
                          style={{ width: '180px', height: '180px', borderRadius: '30px', objectFit: 'cover', border: `6px solid ${theme.cardBg}`, boxShadow: '0 15px 35px rgba(0,0,0,0.15)' }} 
                        />
                      ) : (
                        <div style={{ width: '180px', height: '180px', borderRadius: '30px', background: darkMode ? "#1e293b" : "#e2e8f0", display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                          <i className="bi bi-person text-muted" style={{ fontSize: '70px' }}></i>
                        </div>
                      )}
                    </div>
                    
                    <h3 style={{ fontWeight: '800', color: theme.textMain, marginBottom: '10px', fontSize: '24px' }}>
                      {employee.first_name} {employee.last_name}
                    </h3>
                    
                    <span className="badge" style={{ 
                      borderRadius: '12px', 
                      padding: '8px 20px', 
                      fontSize: '13px',
                      background: employee.status === 'Active' ? '#22c55e20' : '#ef444420',
                      color: employee.status === 'Active' ? '#22c55e' : '#ef4444',
                      border: employee.status === 'Active' ? '1px solid #22c55e40' : '1px solid #ef444440'
                    }}>
                      <i className="bi bi-circle-fill me-2" style={{fontSize: '8px'}}></i>{employee.status}
                    </span>
                    
                    <div className="mt-5 pt-4 border-top" style={{ borderColor: theme.border }}>
                      <div className="d-flex justify-content-between mb-3">
                        <span style={{ color: theme.textMuted, fontSize: '12px', fontWeight: '700' }}>EMPLOYEE ID</span>
                        <span className="fw-bold" style={{ color: theme.textMain }}>#EMP-{employee.id}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span style={{ color: theme.textMuted, fontSize: '12px', fontWeight: '700' }}>JOINING DATE</span>
                        <span className="fw-bold" style={{ color: theme.textMain }}>{employee.hire_date || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Detailed Grid */}
                <div className="col-12 col-lg-8">
                  <div className="row g-3">
                    <div className="col-12 mb-2">
                      <h5 style={{ fontWeight: '800', color: '#10b981', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                         Information Details
                      </h5>
                    </div>

                    {[
                      { label: "Designation", value: employee.designation?.name, icon: "bi-briefcase" },
                      { label: "Department", value: employee.department?.name, icon: "bi-building" },
                      { label: "Phone Number", value: employee.phone, icon: "bi-telephone" },
                      { label: "Email Address", value: employee.email, icon: "bi-envelope" },
                      { label: "Gender", value: employee.gender, icon: "bi-person-check" },
                      { label: "Date of Birth", value: employee.date_of_birth, icon: "bi-calendar-event" },
                    ].map((item, idx) => (
                      <div key={idx} className="col-12 col-md-6">
                        <div style={detailBoxStyle}>
                          <span style={labelStyle}>{item.label}</span>
                          <span style={valueStyle}>
                            <i className={`bi ${item.icon} me-2`} style={{ color: '#10b981' }}></i>
                            {item.value || 'Not Assigned'}
                          </span>
                        </div>
                      </div>
                    ))}

                    <div className="col-12 col-md-6">
                      <div style={{ ...detailBoxStyle, background: darkMode ? "#064e3b" : "#ecfdf5", borderColor: '#10b98130' }}>
                        <span style={{ ...labelStyle, color: '#10b981' }}>Current Monthly Salary</span>
                        <span style={{...valueStyle, color: '#10b981', fontSize: '20px', fontWeight: '800'}}>
                          ৳ {employee.salary ? parseFloat(employee.salary).toLocaleString() : '0.00'}
                        </span>
                      </div>
                    </div>

                    <div className="col-12">
                      <div style={detailBoxStyle}>
                        <span style={labelStyle}>Permanent Address</span>
                        <span style={valueStyle}>
                          <i className="bi bi-geo-alt me-2" style={{ color: '#10b981' }}></i>
                          {employee.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center p-5">
                <i className="bi bi-person-x text-muted" style={{ fontSize: '48px' }}></i>
                <p className="mt-3 text-muted">No employee profile found.</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default ViewEmployee;