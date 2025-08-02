import { useEffect, useRef, useState } from 'react';
import Menu from './Menu';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const dateInputRef = useRef(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Form state with updated keys department_id and designation_id
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    gender: '',
    hire_date: '',
    department_id: '',   // updated key
    designation_id: '',  // updated key
    salary: '',
    profile_picture: null,
    status: 'Active',
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  const selectStyle = {
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%204%205'%3E%3Cpath%20fill='black'%20d='M2%205L0%200h4z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '10px',
    paddingRight: '2rem',
  };

  // Fetch departments and designations
  useEffect(() => {
    fetch(`${BASE_URL}/api/get-dept`)
      .then(res => res.json())
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          setDepartments([]);
        }
      })
      .catch(err => console.error("Dept fetch error:", err));

    fetch(`${BASE_URL}/api/get-desi`)
      .then(res => res.json())
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setDesignations(response.data);
        } else {
          setDesignations([]);
        }
      })
      .catch(err => console.error("Desi fetch error:", err));
  }, []);


  // Handle input changes
  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, [name]: file }));
        setImagePreview(URL.createObjectURL(file));
      } else {
        setFormData(prev => ({ ...prev, [name]: null }));
        setImagePreview(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First Name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{11}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 11 digits';
    }


    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of Birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.hire_date) newErrors.hire_date = 'Hire Date is required';

    if (!formData.department_id) newErrors.department_id = 'Department is required';
    if (!formData.designation_id) newErrors.designation_id = 'Designation is required';

    if (!formData.salary) newErrors.salary = 'Salary is required';
    if (!formData.profile_picture) newErrors.profile_picture = 'Profile Picture is required';

    return newErrors;
  };


  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, profile_picture: null }));
    setImagePreview(null);
  };


  // Submit form data to backend
  const handleSubmit = async e => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    // Show formData in console before submission
    console.log("Form data before submission:");
    for (let [key, value] of Object.entries(formData)) {
      if (key === "profile_picture" && value) {
        console.log(`${key}: ${value.name}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          payload.append(key, value);
        }
      });

      const response = await fetch(`${BASE_URL}/api/add-emplyee`, {
        method: 'POST',
        body: payload,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('Failed to submit form: ' + (errorData.message || response.statusText));
        return;
      }

      navigate("/admin-employee");
      alert('Form submitted successfully!');


      // Reset form after success
      setFormData({
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
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };


  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '1890px',
          height: '1024px',
          margin: '0 auto',
          border: '1px solid #ccc',
          boxSizing: 'border-box',
        }}
      >
        <Header />

        <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          <Menu />
          <main style={{
            flexGrow: 1,
            padding: "40px",
            background: "linear-gradient(to bottom right, #ffffff, #f0eee7)",
            borderRadius: "16px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
            minHeight: "100vh",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}>
            <div className="container mt-4 mb-4">
              <div className="d-flex align-items-center mb-3" style={{ position: "relative" }}>
                {/* Back Button (left aligned) */}
                <button
                  className="btn btn-link position-absolute start-0"
                  onClick={() => window.history.back()}
                  style={{ textDecoration: 'none', fontWeight: 'bold', color: '#285fc7', fontSize: '18px' }}
                >
                  ← Back
                </button>

                {/* Centered Heading */}
                <h3 className="mx-auto" style={{ fontFamily: "sans-serif", marginBottom: '5px' }}>
                  Add Employee
                </h3>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  padding: "30px",
                  minHeight: "90vh",
                  paddingBottom: "100px", // spacing for fixed pagination
                  position: "relative",
                }}
                noValidate
              >
                <div className="row mb-3 mt-5">
                  <div className="col-md-6">
                    <label className="form-label fs-5 text-start h2 d-block"
                      style={{ pointerEvents: 'none' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                    {errors.first_name && (
                      <div className="invalid-feedback">{errors.first_name}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-5 text-start h2 d-block">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fs-5 text-start h2 d-block">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-5 text-start h2 d-block">Phone *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fs-5 text-start h2 d-block">Address *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-5 text-start h2 d-block">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      ref={dateInputRef}
                      className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      onFocus={() => dateInputRef.current?.showPicker?.()} // auto open calendar on focus
                    />
                    {errors.date_of_birth && (
                      <div className="invalid-feedback">{errors.date_of_birth}</div>
                    )}
                  </div>

                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fs-5 text-start h2 d-block">Gender *</label>

                    <select
                      className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      style={selectStyle}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>


                    {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-5 text-start h2 d-block">Hire Date *</label>

                    <input
                      type="date"
                      ref={dateInputRef}
                      className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
                      name="date_of_birth"
                      value={formData.hire_date}
                      onChange={handleChange}
                      onFocus={() => dateInputRef.current?.showPicker?.()} // auto open calendar on focus
                    />
                    {errors.hire_date && (
                      <div className="invalid-feedback">{errors.hire_date}</div>
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fs-5 text-start h2 d-block">
                      Department *
                    </label>
                    <select
                      className={`form-control ${errors.department_id ? 'is-invalid' : ''}`}
                      name="department_id"
                      value={formData.department_id}
                      onChange={handleChange}
                      style={selectStyle}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    {errors.department_id && (
                      <div className="invalid-feedback">{errors.department_id}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-5 text-start h2 d-block">
                      Designation *
                    </label>
                    <select
                      className={`form-control ${errors.designation_id ? 'is-invalid' : ''}`}
                      name="designation_id"
                      value={formData.designation_id}
                      onChange={handleChange}
                      style={selectStyle}
                    >
                      <option value="">Select Designation</option>
                      {designations.map(desi => (
                        <option key={desi.id} value={desi.id}>
                          {desi.name}
                        </option>
                      ))}
                    </select>
                    {errors.designation_id && (
                      <div className="invalid-feedback">{errors.designation_id}</div>
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fs-5 text-start h2 d-block">Salary *</label>
                    <input
                      type="number"
                      className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                    />
                    {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fs-5 text-start h2 d-block">Status</label>
                    <select
                      className="form-control"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      style={selectStyle}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                </div>

                <div className="row mb-4">

                  <div className="col-md-6">
                    <label className="form-label fs-5 text-start h2 d-block">
                      Profile Picture *
                    </label>
                    <input
                      type="file"
                      className={`form-control ${errors.profile_picture ? 'is-invalid' : ''}`}
                      name="profile_picture"
                      onChange={handleChange}
                      accept="image/*"
                    />
                    {errors.profile_picture && (
                      <div className="invalid-feedback">{errors.profile_picture}</div>
                    )}

                    {imagePreview && (
                      <div
                        className="position-relative mt-2"
                        style={{ display: 'inline-block', maxWidth: '150px' }}
                      >
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '25px',
                            height: '25px',
                            fontSize: '18px',
                            lineHeight: '25px',
                            textAlign: 'center',
                            padding: '0',
                            cursor: 'pointer',
                          }}
                          aria-label="Remove image"
                        >
                          &times;
                        </button>


                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                          }}
                        />
                      </div>
                    )}

                  </div>

                </div>

                <button
                  type="submit"
                  className="btn text-white btn-lg"
                  style={{ backgroundColor: '#fd7e14' }}
                >
                  Submit
                </button>
              </form>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AddEmployee;
