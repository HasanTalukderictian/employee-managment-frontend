import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

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

  const detailBoxStyle = {
    padding: '20px',
    borderRadius: '12px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    height: '100%'
  };

  const labelStyle = {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '5px',
    display: 'block'
  };

  const valueStyle = {
    fontSize: '16px',
    color: '#1e293b',
    fontWeight: '600'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '1890px', minHeight: '100vh', margin: '0 auto', background: '#f8fafc' }}>
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: "40px", background: "#f1f5f9", overflowY: 'auto' }}>
          
          <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", padding: "40px", minHeight: '800px' }}>
            
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-4">
              <button onClick={() => navigate(-1)} className="btn btn-light" style={{ borderRadius: '10px', fontWeight: '600', color: '#64748b', border: '1px solid #e2e8f0' }}>
                <i className="bi bi-arrow-left me-2"></i>Back to List
              </button>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Employee Profile Details</h2>
              <button onClick={() => window.print()} className="btn btn-dark" style={{ borderRadius: '10px', fontWeight: '600' }}>
                <i className="bi bi-printer me-2"></i>Print Details
              </button>
            </div>

            {loading ? (
              <div className="text-center p-5"><div className="spinner-border text-success" role="status"></div><p className="mt-3">Loading Profile...</p></div>
            ) : error ? (
              <div className="alert alert-danger shadow-sm">{error}</div>
            ) : employee ? (
              <div className="row g-5">
                
                {/* Left Side: Profile Card */}
                <div className="col-md-4">
                  <div style={{ position: 'relative', textAlign: 'center', background: '#fff', borderRadius: '20px', padding: '30px', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                    <div style={{ marginBottom: '20px' }}>
                      {employee.profile_picture ? (
                        <img 
                          src={`${BASE_URL}/${employee.profile_picture}`} 
                          alt="Profile" 
                          style={{ width: '220px', height: '220px', borderRadius: '50%', objectFit: 'cover', border: '6px solid #ecfdf5', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} 
                        />
                      ) : (
                        <div style={{ width: '220px', height: '220px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                          <i className="bi bi-person text-muted" style={{ fontSize: '80px' }}></i>
                        </div>
                      )}
                    </div>
                    <h3 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>{employee.first_name} {employee.last_name}</h3>
                    <p className="badge bg-success-subtle text-success px-3 py-2" style={{ borderRadius: '20px', fontSize: '14px' }}>{employee.status}</p>
                    
                    <div className="mt-4 pt-4 border-top">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">ID Number:</span>
                        <span className="fw-bold text-dark">#EMP-{employee.id}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Hire Date:</span>
                        <span className="fw-bold text-dark">{employee.hire_date || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Detailed Info */}
                <div className="col-md-8">
                  <div className="row g-4">
                    <div className="col-12">
                      <h5 style={{ fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center' }}>
                        <i className="bi bi-person-lines-fill me-2"></i> Information Overview
                      </h5>
                    </div>

                    <div className="col-md-6">
                      <div style={detailBoxStyle}>
                        <span style={labelStyle}>Full Name</span>
                        <span style={valueStyle}>{employee.first_name} {employee.last_name}</span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div style={detailBoxStyle}>
                        <span style={labelStyle}>Designation</span>
                        <span style={valueStyle}>{employee.designation?.name || 'Not Assigned'}</span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div style={detailBoxStyle}>
                        <span style={labelStyle}>Phone Number</span>
                        <span style={valueStyle}><i className="bi bi-telephone-fill me-2 text-muted"></i>{employee.phone}</span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div style={detailBoxStyle}>
                        <span style={labelStyle}>Email Address</span>
                        <span style={valueStyle}><i className="bi bi-envelope-at-fill me-2 text-muted"></i>{employee.email}</span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div style={detailBoxStyle}>
                        <span style={labelStyle}>Department</span>
                        <span style={valueStyle}>{employee.department?.name || 'Not Assigned'}</span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div style={detailBoxStyle}>
                        <span style={labelStyle}>Gender</span>
                        <span style={valueStyle}>{employee.gender}</span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div style={detailBoxStyle}>
                        <span style={labelStyle}>Date of Birth</span>
                        <span style={valueStyle}><i className="bi bi-calendar-event me-2 text-muted"></i>{employee.date_of_birth}</span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div style={detailBoxStyle}>
                        <span style={labelStyle}>Current Salary</span>
                        <span style={valueStyle} className="text-success">৳ {employee.salary || '0.00'}</span>
                      </div>
                    </div>

                    <div className="col-12">
                      <div style={detailBoxStyle}>
                        <span style={labelStyle}>Permanent Address</span>
                        <span style={valueStyle}><i className="bi bi-geo-alt-fill me-2 text-muted"></i>{employee.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center p-5">
                <i className="bi bi-exclamation-circle text-muted" style={{ fontSize: '48px' }}></i>
                <p className="mt-3">No employee data found.</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ViewEmployee;