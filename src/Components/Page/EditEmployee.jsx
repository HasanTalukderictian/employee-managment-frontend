import { useEffect, useState, useRef } from 'react';
import Menu from './Menu';
import Header from './Header';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import toast, { Toaster } from 'react-hot-toast';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const fileInputRef = useRef(null);

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    gender: '',
    hire_date: '', // API missing input
    department_id: '',
    designation_id: '',
    salary: '',
    profile_picture: null,
    status: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // 1. Fetch Departments
    fetch(`${BASE_URL}/api/get-dept`)
      .then(res => res.json())
      .then(res => setDepartments(res.data || []))
      .catch(() => toast.error("Department load fail hoyeche"));

    // 2. Fetch Designations
    fetch(`${BASE_URL}/api/get-desi`)
      .then(res => res.json())
      .then(res => setDesignations(res.data || []))
      .catch(() => toast.error("Designation load fail hoyeche"));

    // 3. Fetch Existing Employee Data
    fetch(`${BASE_URL}/api/get-employee/${id}`)
      .then(res => res.json())
      .then(response => {
        if (response.employee) {
          const emp = response.employee;
          setFormData({
            ...emp,
            profile_picture: null 
          });
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
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      // Laravel updates via POST need _method PUT
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

  // Modern Styles
  const cardStyle = { background: "#fff", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", padding: "45px", border: '1px solid #f1f5f9' };
  const inputStyle = { borderRadius: '12px', border: '1px solid #e2e8f0', padding: '14px 18px', fontSize: '15px', backgroundColor: '#fdfdfd' };
  const sectionLabel = { color: '#059669', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', display: 'block' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '1890px', minHeight: '100vh', margin: '0 auto', background: '#f8fafc' }}>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: "50px", background: "#f1f5f9" }}>
          
          <div style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>Edit Employee Profile</h2>
                <p className='text-muted'>Modify employee records and account access</p>
              </div>
              <button onClick={() => navigate(-1)} className="btn shadow-sm" style={{ borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', fontWeight: '600', padding: '10px 20px' }}>
                <i className="bi bi-arrow-left me-2"></i>Back
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                
                <div className="col-12">
                  <span style={sectionLabel}>General Information</span>
                </div>

                <div className="col-md-4">
                  <label className="fw-bold mb-2 small text-secondary">First Name</label>
                  <input type="text" name="first_name" className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} style={inputStyle} value={formData.first_name} onChange={handleChange} />
                </div>

                <div className="col-md-4">
                  <label className="fw-bold mb-2 small text-secondary">Last Name</label>
                  <input type="text" name="last_name" className="form-control" style={inputStyle} value={formData.last_name} onChange={handleChange} />
                </div>

                <div className="col-md-4">
                  <label className="fw-bold mb-2 small text-secondary">Email Address</label>
                  <input type="email" name="email" className="form-control" style={inputStyle} value={formData.email} onChange={handleChange} />
                </div>

                <div className="col-md-4">
                  <label className="fw-bold mb-2 small text-secondary">Phone Number</label>
                  <input type="text" name="phone" className="form-control" style={inputStyle} value={formData.phone} onChange={handleChange} />
                </div>

                <div className="col-md-4">
                  <label className="fw-bold mb-2 small text-secondary">Date of Birth</label>
                  <input type="date" name="date_of_birth" className="form-control" style={inputStyle} value={formData.date_of_birth} onChange={handleChange} />
                </div>

                <div className="col-md-4">
                  <label className="fw-bold mb-2 small text-secondary">Gender</label>
                  <select name="gender" className="form-select" style={inputStyle} value={formData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-12 mt-5">
                  <span style={sectionLabel}>Job & Designation</span>
                </div>

                <div className="col-md-4">
                  <label className="fw-bold mb-2 small text-secondary">Department</label>
                  <select name="department_id" className="form-select" style={inputStyle} value={formData.department_id} onChange={handleChange}>
                    <option value="">Select Department</option>
                    {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="fw-bold mb-2 small text-secondary">Designation</label>
                  <select name="designation_id" className="form-select" style={inputStyle} value={formData.designation_id} onChange={handleChange}>
                    <option value="">Select Designation</option>
                    {designations.map(desi => <option key={desi.id} value={desi.id}>{desi.name}</option>)}
                  </select>
                </div>

                {/* Hire Date Added as per API requirement */}
                <div className="col-md-4">
                  <label className="fw-bold mb-2 small text-secondary">Hire Date</label>
                  <input type="date" name="hire_date" className="form-control" style={inputStyle} value={formData.hire_date} onChange={handleChange} />
                </div>

                <div className="col-md-4">
                  <label className="fw-bold mb-2 small text-secondary">Monthly Salary</label>
                  <input type="number" name="salary" className="form-control" style={inputStyle} value={formData.salary} onChange={handleChange} />
                </div>

                <div className="col-md-4">
                    <label className="fw-bold mb-2 small text-secondary">Account Status</label>
                    <select name="status" className="form-select" style={inputStyle} value={formData.status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div className="col-md-12">
                  <label className="fw-bold mb-2 small text-secondary">Full Address</label>
                  <textarea name="address" className="form-control" style={{...inputStyle, height: '80px'}} value={formData.address} onChange={handleChange}></textarea>
                </div>

                <div className="col-md-6 mt-5">
                  <label className="fw-bold mb-3 d-block">Profile Picture</label>
                  <div className='d-flex align-items-center gap-4' style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ position: 'relative' }}>
                        <img src={imagePreview || 'https://via.placeholder.com/120'} alt="Preview" style={{ width: '110px', height: '110px', borderRadius: '12px', objectFit: 'cover', background: '#fff', border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                    </div>
                    <div className='flex-grow-1'>
                        <input type="file" ref={fileInputRef} name="profile_picture" hidden onChange={handleChange} accept="image/*" />
                        <button type="button" onClick={() => fileInputRef.current.click()} className='btn btn-dark btn-sm mb-2' style={{ borderRadius: '8px' }}>Change Photo</button>
                        <p className='text-muted small mb-0'>Accepted files: JPG, PNG. Max size 200KB</p>
                    </div>
                  </div>
                </div>

                <div className="col-12 mt-5">
                  <div className='d-flex justify-content-end gap-3 pt-4' style={{ borderTop: '1px solid #f1f5f9' }}>
                    <button type="button" onClick={() => navigate(-1)} className="btn px-5" style={{ borderRadius: '12px', fontWeight: '600', color: '#64748b' }}>Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary px-5 py-3 shadow" style={{ borderRadius: '12px', fontWeight: '700', backgroundColor: '#059669', border: 'none' }}>
                      {isSubmitting ? 'Processing...' : 'Update Records'}
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

export default EditEmployee;