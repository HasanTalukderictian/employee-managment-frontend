import React, { useEffect, useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import '../../App.css'; 
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const AddUser = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState('');
  const [employees, setEmployees] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Theme configuration
  const theme = {
    bg: darkMode ? "#0f172a" : "#f4f7f6",
    cardBg: darkMode ? "#1e293b" : "#ffffff",
    text: darkMode ? "#f8fafc" : "#2c3e50",
    label: darkMode ? "#94a3b8" : "#6c757d",
    border: darkMode ? "#334155" : "#f8f9fa",
    inputBg: darkMode ? "#0f172a" : "#f8f9fa",
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/get-emplyee`);
        const result = await response.json();
        setEmployees(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        toast.error('Error fetching employees list');
      }
    };
    fetchEmployees();
  }, [BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFadeOut(true);

    const payload = { email, password, role, employee_id: employeeId };

    try {
      const response = await fetch(`${BASE_URL}/api/users-store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }

      toast.success('User created successfully!');

      setTimeout(() => {
        setEmail('');
        setPassword('');
        setRole('');
        setEmployeeId('');
        setFadeOut(false);
        setIsSubmitting(false);
        navigate('/admin-users');
      }, 1500);

    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setFadeOut(false);
      setIsSubmitting(false);
    }
  };

  const fadeClass = fadeOut ? 'fade-out' : '';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      minHeight: '100vh', 
      backgroundColor: theme.bg, 
      transition: '0.3s ease' 
    }}>
      <Toaster position="top-right" reverseOrder={false} />
      
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        
        <main style={{ flexGrow: 1, padding: '30px', overflowY: 'auto' }}>
          <div style={{ 
            background: theme.cardBg, 
            borderRadius: '20px', 
            boxShadow: darkMode ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.08)', 
            padding: '40px', 
            maxWidth: '1000px', 
            margin: '0 auto', 
            minHeight: '80vh',
            border: darkMode ? `1px solid ${theme.border}` : 'none'
          }}>
            
            {/* Header Section */}
            <div className="d-flex align-items-center mb-5" style={{ borderBottom: `2px solid ${theme.border}`, paddingBottom: '20px' }}>
              <button
                className="btn btn-outline-primary shadow-sm d-flex align-items-center"
                onClick={() => navigate(-1)}
                style={{ borderRadius: '10px', fontWeight: '600', padding: '8px 20px' }}
              >
                <i className="bi bi-arrow-left me-2"></i> Back
              </button>
              <h2 className="mx-auto mb-0" style={{ fontWeight: '800', color: theme.text, fontFamily: 'Inter, sans-serif' }}>
                Create New User Account
              </h2>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2" style={{ color: theme.label }}>Email Address</label>
                  <input
                    type="email"
                    name="new_user_email_field"
                    autoComplete="one-time-code"
                    className={`form-control form-control-lg border-0 shadow-sm ${fadeClass}`}
                    style={{ 
                      backgroundColor: theme.inputBg, 
                      color: theme.text, 
                      borderRadius: '12px', 
                      fontSize: '16px', 
                      padding: '15px' 
                    }}
                    placeholder="Enter employee email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2" style={{ color: theme.label }}>Password</label>
                  <input
                    type="password"
                    name="new_user_password_field" 
                    autoComplete="new-password"
                    className={`form-control form-control-lg border-0 shadow-sm ${fadeClass}`}
                    style={{ 
                      backgroundColor: theme.inputBg, 
                      color: theme.text, 
                      borderRadius: '12px', 
                      fontSize: '16px', 
                      padding: '15px' 
                    }}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="row mb-5">
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2" style={{ color: theme.label }}>Assign Role</label>
                  <select
                    className={`form-select form-select-lg border-0 shadow-sm ${fadeClass}`}
                    style={{ 
                      backgroundColor: theme.inputBg, 
                      color: theme.text, 
                      borderRadius: '12px', 
                      fontSize: '16px', 
                      padding: '15px' 
                    }}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="" style={{ background: theme.cardBg }}>-- Choose Access Level --</option>
                    <option value="admin" style={{ background: theme.cardBg }}>Administrator</option>
                    <option value="user" style={{ background: theme.cardBg }}>Standard User</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold mb-2" style={{ color: theme.label }}>Select Linked Employee</label>
                  <select
                    className={`form-select form-select-lg border-0 shadow-sm ${fadeClass}`}
                    style={{ 
                      backgroundColor: theme.inputBg, 
                      color: theme.text, 
                      borderRadius: '12px', 
                      fontSize: '16px', 
                      padding: '15px' 
                    }}
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                  >
                    <option value="" style={{ background: theme.cardBg }}>-- Select Employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id} style={{ background: theme.cardBg }}>
                        {emp.first_name} {emp.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-center mt-5">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-warning btn-lg px-5 py-3 shadow" 
                  style={{ 
                    borderRadius: '15px', 
                    fontWeight: '700', 
                    minWidth: '280px', 
                    fontSize: '18px',
                    transition: 'all 0.3s ease',
                    color: '#000'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-lock-fill me-2"></i> Save User Access
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default AddUser;