import { useEffect, useState, useRef } from 'react';
import Menu from './Menu';
import Header from './Header';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import toast, { Toaster } from 'react-hot-toast';

const EditEmployee = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const fileInputRef = useRef(null);

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', address: '',
    date_of_birth: '', gender: '', hire_date: '', department_id: '',
    designation_id: '', salary: '', profile_picture: null, status: '',
  });

  const [errors, setErrors] = useState({});

  // Theme Config
  const theme = {
    bg: darkMode ? "#0f172a" : "#f1f5f9",
    cardBg: darkMode ? "#1e293b" : "#ffffff",
    inputBg: darkMode ? "#334155" : "#fdfdfd",
    textMain: darkMode ? "#f8fafc" : "#1e293b",
    textMuted: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#e2e8f0"
  };

  // Sidebar width constants for calculation
  const sidebarWidth = isExpanded ? '260px' : '80px';

  useEffect(() => {
    fetch(`${BASE_URL}/api/get-dept`)
      .then(res => res.json())
      .then(res => setDepartments(res.data || []))
      .catch(() => toast.error("Department load fail hoyeche"));

    fetch(`${BASE_URL}/api/get-desi`)
      .then(res => res.json())
      .then(res => setDesignations(res.data || []))
      .catch(() => toast.error("Designation load fail hoyeche"));

    fetch(`${BASE_URL}/api/get-employee/${id}`)
      .then(res => res.json())
      .then(response => {
        if (response.employee) {
          const emp = response.employee;
          setFormData({ ...emp, profile_picture: null });
          if(emp.profile_picture) setImagePreview(`${BASE_URL}/${emp.profile_picture}`);
        }
      })
      .catch(() => toast.error("Data fetch failed"));
  }, [id, BASE_URL]);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      const file = files[0];
      if (file) {
        const loadingImg = toast.loading("Processing image...");
        try {
          const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };
          const compressedFile = await imageCompression(file, options);
          setFormData(prev => ({ ...prev, [name]: compressedFile }));
          setImagePreview(URL.createObjectURL(compressedFile));
          toast.success("Image optimized!", { id: loadingImg });
        } catch (error) {
          toast.error('Image compression failed', { id: loadingImg });
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    const updateToast = toast.loading("Updating records...");

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) payload.append(key, value);
      });
      payload.append('_method', 'POST'); 

      const response = await fetch(`${BASE_URL}/api/update-emplyee/${id}`, {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' },
      });

      const resData = await response.json();
      if (response.ok) {
        toast.success('Information updated successfully!', { id: updateToast });
        setTimeout(() => navigate("/admin-employee"), 1500);
      } else {
        toast.dismiss(updateToast);
        if (resData.errors) {
          setErrors(resData.errors);
          Object.values(resData.errors).flat().forEach(msg => toast.error(msg));
        } else {
          toast.error(resData.message || 'Update failed');
        }
      }
    } catch (error) {
      toast.error('Server error occurred', { id: updateToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardStyle = { 
    background: theme.cardBg, 
    borderRadius: "24px", 
    boxShadow: darkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 40px rgba(0,0,0,0.03)", 
    padding: "30px", 
    border: `1px solid ${theme.border}`,
    transition: 'all 0.3s ease'
  };

  const inputStyle = { 
    borderRadius: '12px', 
    border: `1px solid ${theme.border}`, 
    padding: '12px 15px', 
    fontSize: '15px', 
    backgroundColor: theme.inputBg,
    color: theme.textMain
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', background: theme.bg, transition: '0.3s' }}>
      <Toaster position="top-right" reverseOrder={false} />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        {/* Menu Section */}
        <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        
        {/* Main Content Section - Dynamic Width fix */}
        <main style={{ 
          flexGrow: 1, 
          padding: "25px", 
          overflowY: 'auto',
          width: `calc(100% - ${sidebarWidth})`, // মেনুর উইডথ বাদ দিয়ে বাকিটা
          marginLeft: '0', // যতি মেনু absolute না হয়
          transition: 'all 0.3s ease' 
        }}>
          <div style={cardStyle}>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: theme.textMain, marginBottom: '5px' }}>Edit Employee Profile</h2>
                <p style={{ color: theme.textMuted }} className='mb-0 small'>Modify employee records and account access</p>
              </div>
              <button onClick={() => navigate(-1)} className="btn shadow-sm" 
                style={{ borderRadius: '12px', background: theme.cardBg, border: `1px solid ${theme.border}`, fontWeight: '600', color: theme.textMain, padding: '8px 18px' }}>
                <i className="bi bi-arrow-left me-2"></i>Back
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 mt-2">
                  <span style={{ color: '#059669', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>General Information</span>
                </div>

                {[
                  { label: "First Name", name: "first_name", type: "text" },
                  { label: "Last Name", name: "last_name", type: "text" },
                  { label: "Email Address", name: "email", type: "email" },
                  { label: "Phone Number", name: "phone", type: "text" },
                  { label: "Date of Birth", name: "date_of_birth", type: "date" },
                ].map((field) => (
                  <div key={field.name} className="col-12 col-md-4">
                    <label style={{ color: theme.textMuted }} className="fw-bold mb-1 small">{field.label}</label>
                    <input 
                      type={field.type} 
                      name={field.name} 
                      className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`} 
                      style={inputStyle} 
                      value={formData[field.name] || ''} 
                      onChange={handleChange} 
                    />
                  </div>
                ))}

                <div className="col-12 col-md-4">
                  <label style={{ color: theme.textMuted }} className="fw-bold mb-1 small">Gender</label>
                  <select name="gender" className="form-select" style={inputStyle} value={formData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Second Section */}
                <div className="col-12 mt-4">
                   <span style={{ color: '#059669', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Job & Designation</span>
                </div>

                <div className="col-12 col-md-4">
                  <label style={{ color: theme.textMuted }} className="fw-bold mb-1 small">Department</label>
                  <select name="department_id" className="form-select" style={inputStyle} value={formData.department_id} onChange={handleChange}>
                    <option value="">Select Department</option>
                    {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label style={{ color: theme.textMuted }} className="fw-bold mb-1 small">Designation</label>
                  <select name="designation_id" className="form-select" style={inputStyle} value={formData.designation_id} onChange={handleChange}>
                    <option value="">Select Designation</option>
                    {designations.map(desi => <option key={desi.id} value={desi.id}>{desi.name}</option>)}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label style={{ color: theme.textMuted }} className="fw-bold mb-1 small">Hire Date</label>
                  <input type="date" name="hire_date" className="form-control" style={inputStyle} value={formData.hire_date || ''} onChange={handleChange} />
                </div>

                <div className="col-12 col-md-4">
                  <label style={{ color: theme.textMuted }} className="fw-bold mb-1 small">Monthly Salary</label>
                  <input type="number" name="salary" className="form-control" style={inputStyle} value={formData.salary || ''} onChange={handleChange} />
                </div>

                <div className="col-12 col-md-4">
                  <label style={{ color: theme.textMuted }} className="fw-bold mb-1 small">Account Status</label>
                  <select name="status" className="form-select" style={inputStyle} value={formData.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-12">
                  <label style={{ color: theme.textMuted }} className="fw-bold mb-1 small">Full Address</label>
                  <textarea name="address" className="form-control" style={{...inputStyle, height: '80px'}} value={formData.address || ''} onChange={handleChange}></textarea>
                </div>

                {/* Profile Pic Section */}
                <div className="col-12 mt-4">
                  <label style={{ color: theme.textMain }} className="fw-bold mb-3 d-block">Profile Picture</label>
                  <div className='d-flex flex-wrap align-items-center gap-4' style={{ background: theme.inputBg, padding: '20px', borderRadius: '15px', border: `1px dashed ${theme.border}` }}>
                    <img src={imagePreview || 'https://via.placeholder.com/120'} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover', border: `4px solid ${theme.cardBg}`, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                    <div className='flex-grow-1'>
                      <input type="file" ref={fileInputRef} name="profile_picture" hidden onChange={handleChange} accept="image/*" />
                      <button type="button" onClick={() => fileInputRef.current.click()} className='btn btn-dark btn-sm mb-2' style={{ borderRadius: '8px' }}>Change Photo</button>
                      <p style={{ color: theme.textMuted }} className='small mb-0'>Max size 200KB</p>
                    </div>
                  </div>
                </div>

                <div className="col-12 mt-4 pt-3" style={{ borderTop: `1px solid ${theme.border}` }}>
                  <div className='d-flex justify-content-end gap-3'>
                    <button type="button" onClick={() => navigate(-1)} className="btn px-4" style={{ borderRadius: '12px', color: theme.textMuted }}>Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary px-5 py-2 shadow" style={{ borderRadius: '12px', fontWeight: '700', backgroundColor: '#059669', border: 'none' }}>
                      {isSubmitting ? 'Processing...' : 'Update Records'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default EditEmployee;