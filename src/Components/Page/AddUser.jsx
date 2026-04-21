import React, { useEffect, useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import '../../App.css'; 
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const AddUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState('');
  const [employees, setEmployees] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

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
    <div style={{ display: 'flex', flexDirection: 'column', width: '1890px', height: '1024px', margin: '0 auto', boxSizing: 'border-box', backgroundColor: '#f4f7f6' }}>
      {/* Toast Notification Container */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <Header />
      
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        
        <main style={{ flexGrow: 1, padding: '40px', background: '#f0eee7', overflowY: 'auto' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '40px', maxWidth: '1100px', margin: '0 auto', minHeight: '80vh' }}>
            
            {/* Top Navigation Row */}
            <div className="d-flex align-items-center mb-5" style={{ borderBottom: '2px solid #f8f9fa', paddingBottom: '20px' }}>
              <button
                className="btn btn-outline-primary shadow-sm d-flex align-items-center"
                onClick={() => navigate(-1)}
                style={{ borderRadius: '10px', fontWeight: '600', padding: '8px 20px' }}
              >
                <i className="bi bi-arrow-left me-2"></i> Back
              </button>
              <h2 className="mx-auto mb-0" style={{ fontWeight: '800', color: '#2c3e50', fontFamily: 'Inter, sans-serif' }}>
                Create New User Account
              </h2>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} autoComplete="off">
              {/* Row 1: Email & Password */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold text-secondary mb-2">Email Address</label>
                  <input
                    type="email"
                    name="new_user_email_field" // Unique name to prevent auto-fill
                    autoComplete="one-time-code" // Extra trick to confuse browser autofill
                    className={`form-control form-control-lg border-0 shadow-sm ${fadeClass}`}
                    style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', fontSize: '16px', padding: '15px' }}
                    placeholder="Enter employee email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold text-secondary mb-2">Password</label>
                  <input
                    type="password"
                    name="new_user_password_field" 
                    autoComplete="new-password" // Strongly tells browser NOT to use saved passwords
                    className={`form-control form-control-lg border-0 shadow-sm ${fadeClass}`}
                    style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', fontSize: '16px', padding: '15px' }}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Role & Employee Selection */}
              <div className="row mb-5">
                <div className="col-md-6">
                  <label className="form-label fw-bold text-secondary mb-2">Assign Role</label>
                  <select
                    className={`form-select form-select-lg border-0 shadow-sm ${fadeClass}`}
                    style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', fontSize: '16px', padding: '15px' }}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Access Level --</option>
                    <option value="admin">Administrator</option>
                    <option value="user">Standard User</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold text-secondary mb-2">Select Linked Employee</label>
                  <select
                    className={`form-select form-select-lg border-0 shadow-sm ${fadeClass}`}
                    style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', fontSize: '16px', padding: '15px' }}
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.first_name} {emp.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Button */}
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
      <Footer />
    </div>
  );
};

export default AddUser;