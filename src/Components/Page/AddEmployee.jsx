import { useEffect, useState } from 'react';
import Menu from './Menu';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

const AddEmployee = () => {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    gender: '',
    hire_date: '',
    department_id: '',
    designation_id: '',
    salary: '',
    profile_picture: null,
    status: 'Active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch(`${BASE_URL}/api/get-dept`).then(res => res.json()).then(response => {
      setDepartments(response.data || []);
    }).catch(err => console.error("Dept fetch error:", err));

    fetch(`${BASE_URL}/api/get-desi`).then(res => res.json()).then(response => {
      setDesignations(response.data || []);
    }).catch(err => console.error("Desi fetch error:", err));
  }, []);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      const file = files[0];
      if (file) {
        try {
          const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };
          const compressedFile = await imageCompression(file, options);
          setFormData(prev => ({ ...prev, [name]: compressedFile }));
          setImagePreview(URL.createObjectURL(compressedFile));
        } catch (error) {
          alert('Failed to compress image.');
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.department_id) newErrors.department_id = 'Department is required';
    if (!formData.designation_id) newErrors.designation_id = 'Designation is required';
    if (!formData.profile_picture) newErrors.profile_picture = 'Profile Picture is required';
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) payload.append(key, value);
      });

      const response = await fetch(`${BASE_URL}/api/add-emplyee`, {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        alert('Employee added successfully!');
        navigate("/admin-employee");
      } else {
        const errorData = await response.json();
        alert('Error: ' + errorData.message);
      }
    } catch (error) {
      alert('An error occurred.');
    }
  };

  const inputStyle = {
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    padding: '12px 15px',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    backgroundColor: '#fcfcfc'
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#475569',
    marginBottom: '8px',
    fontSize: '14px',
    display: 'block'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%',             // Fixed 1890px remove kore 100% kora holo
      minHeight: '100vh', 
      margin: '0', 
      background: '#f8fafc',
      boxSizing: 'border-box'
    }}>
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main style={{ 
          flexGrow: 1, 
          padding: "30px",        // Padding laptop er jonno aktu optimal kora holo
          background: "#f1f5f9", 
          overflowY: 'auto',
          width: '100%' 
        }}>
          
          <div style={{ 
            background: "#fff", 
            borderRadius: "20px", 
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)", 
            padding: "30px",      // Internal padding optimal kora holo
            width: '100%',
            maxWidth: '1600px',   // Onek boro screen e jate aktu gochano thake
            margin: '0 auto' 
          }}>
            
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3">
              <button onClick={() => navigate(-1)} className="btn btn-light shadow-sm" style={{ borderRadius: '10px', fontWeight: '600', color: '#64748b' }}>
                <i className="bi bi-arrow-left me-2"></i>Back to List
              </button>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0, textAlign: 'center' }}>Add New Employee</h2>
              <div className="d-none d-md-block" style={{ width: '120px' }}></div> {/* Spacer only for desktop */}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                
                {/* Personal Info Section */}
                <div className="col-12 mb-2">
                  <h5 style={{ color: '#10b981', fontWeight: '700', borderBottom: '2px solid #ecfdf5', paddingBottom: '10px' }}>Personal Information</h5>
                </div>

                <div className="col-xl-4 col-md-6">
                  <label style={labelStyle}>First Name *</label>
                  <input type="text" name="first_name" className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} style={inputStyle} value={formData.first_name} onChange={handleChange} placeholder="John" />
                  {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                </div>

                <div className="col-xl-4 col-md-6">
                  <label style={labelStyle}>Last Name</label>
                  <input type="text" name="last_name" className="form-control" style={inputStyle} value={formData.last_name} onChange={handleChange} placeholder="Doe" />
                </div>

                <div className="col-xl-4 col-md-6">
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" name="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} style={inputStyle} value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="col-xl-4 col-md-6">
                  <label style={labelStyle}>Phone Number *</label>
                  <input type="text" name="phone" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} style={inputStyle} value={formData.phone} onChange={handleChange} placeholder="017xxxxxxxx" />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                <div className="col-xl-4 col-md-6">
                  <label style={labelStyle}>Date of Birth *</label>
                  <input type="date" name="date_of_birth" className="form-control" style={inputStyle} value={formData.date_of_birth} onChange={handleChange} />
                </div>

                <div className="col-xl-4 col-md-6">
                  <label style={labelStyle}>Gender *</label>
                  <select name="gender" className="form-select" style={inputStyle} value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Job Info Section */}
                <div className="col-12 mt-5 mb-2">
                  <h5 style={{ color: '#10b981', fontWeight: '700', borderBottom: '2px solid #ecfdf5', paddingBottom: '10px' }}>Employment Details</h5>
                </div>

                <div className="col-xl-4 col-md-6">
                  <label style={labelStyle}>Department *</label>
                  <select name="department_id" className="form-select" style={inputStyle} value={formData.department_id} onChange={handleChange}>
                    <option value="">Select Department</option>
                    {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                  </select>
                </div>

                <div className="col-xl-4 col-md-6">
                  <label style={labelStyle}>Designation *</label>
                  <select name="designation_id" className="form-select" style={inputStyle} value={formData.designation_id} onChange={handleChange}>
                    <option value="">Select Designation</option>
                    {designations.map(desi => <option key={desi.id} value={desi.id}>{desi.name}</option>)}
                  </select>
                </div>

                <div className="col-xl-4 col-md-6">
                  <label style={labelStyle}>Hire Date *</label>
                  <input type="date" name="hire_date" className="form-control" style={inputStyle} value={formData.hire_date} onChange={handleChange} />
                </div>

                <div className="col-12">
                  <label style={labelStyle}>Full Address *</label>
                  <textarea name="address" className="form-control" style={{ ...inputStyle, height: '100px' }} value={formData.address} onChange={handleChange} placeholder="Enter full address here..."></textarea>
                </div>

                {/* Profile Upload Section */}
                <div className="col-xl-6 col-md-12 mt-4">
                  <label style={labelStyle}>Profile Picture *</label>
                  <div style={{ border: '2px dashed #e2e8f0', borderRadius: '15px', padding: '20px', textAlign: 'center', background: '#f8fafc' }}>
                    <input type="file" name="profile_picture" className="form-control mb-3 shadow-sm" onChange={handleChange} accept="image/*" />
                    {imagePreview && (
                      <div className="mt-2 position-relative d-inline-block">
                        <img src={imagePreview} alt="Preview" style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                        <button type="button" onClick={() => setImagePreview(null)} className="btn btn-danger btn-sm position-absolute shadow-sm" style={{ top: '-10px', right: '-10px', borderRadius: '50%', padding: '2px 6px' }}>×</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-xl-6 col-md-12 mt-4 d-flex align-items-center">
                   <div style={{ width: '100%', background: '#fff9f5', padding: '25px', borderRadius: '15px', border: '1px solid #ffeada' }}>
                      <p style={{ margin: 0, fontSize: '14px', color: '#c2410c', lineHeight: '1.6' }}>
                        <i className="bi bi-info-circle-fill me-2"></i>
                        <strong>Note:</strong> Please ensure all marked (*) fields are filled correctly. 
                        Profile pictures are automatically compressed to ensure system speed. 
                        Use a clear square image for best results.
                      </p>
                   </div>
                </div>

                <div className="col-12 mt-5 text-end">
                  <hr style={{ borderColor: '#f1f5f9', marginBottom: '30px' }} />
                  <div className="d-flex flex-wrap justify-content-end gap-3">
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-outline-secondary" style={{ padding: '12px 35px', borderRadius: '12px', fontWeight: '600' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '12px 50px', borderRadius: '12px', fontWeight: '600', backgroundColor: '#10b981', border: 'none', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}>
                      Save Employee
                    </button>
                  </div>
                </div>

              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AddEmployee;