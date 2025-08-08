import React, { useEffect, useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import '../../App.css'; // 👈 Import CSS if it's in a file
import { useNavigate } from 'react-router-dom';


const AddUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState('');
  const [employees, setEmployees] = useState([]);
  const [fadeOut, setFadeOut] = useState(false); // 👈 state to trigger fade-out
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/get-emplyee`);
        const result = await response.json();
        setEmployees(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  setFadeOut(true); // start fade-out animation

  // Prepare data payload
  const payload = {
    email,
    password,
    role,
    employee_id: employeeId,
  };

  try {
    const response = await fetch(`${BASE_URL}/api/users-store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accpet' : 'application/json'
        
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user');
    }

    alert('User created successfully!');

    // Optional: Reset form fields and fade-out after submission
    setTimeout(() => {
      setEmail('');
      setPassword('');
      setRole('');
      setEmployeeId('');
      setFadeOut(false);
       navigate('/admin-users');
    }, 1000);

  } catch (error) {
    alert(`Error: ${error.message}`);
    setFadeOut(false);
  }
};


  const fadeClass = fadeOut ? 'fade-out' : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '1890px', height: '1024px', margin: '0 auto', boxSizing: 'border-box' }}>
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: '40px', background: '#f0eee7', overflowY: 'auto', position: 'relative' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '30px', minHeight: '90vh', position: 'relative' }}>
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
                  Create User
                </h3>
              </div>
            <form onSubmit={handleSubmit}>
              {/* Row 1 */}
              <div style={{ display: 'flex', gap: '20px' }} className="mb-3">
                <div style={{ flex: 1 }}>
                  <label className="form-label fs-5 text-start h2 d-block">Email</label>
                  <input
                    type="email"
                    className={`form-control ${fadeClass}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label fs-5 text-start h2 d-block">Password</label>
                  <input
                    type="password"
                    className={`form-control ${fadeClass}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div style={{ display: 'flex', gap: '20px' }} className="mb-3">
                <div style={{ flex: 1 }}>
                  <label className="form-label fs-5 text-start h2 d-block">Role</label>
                  <select
                    className={`form-control ${fadeClass}`}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">-- Select a role --</option>
                    <option value="Admin">Admin</option>
                    <option value="Normal User">Normal User</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label fs-5 text-start h2 d-block">Select Employee</label>
                  <select
                    className={`form-control ${fadeClass}`}
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                  >
                    <option value="">-- Select an employee --</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.first_name} {emp.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-30">
                <button type="submit" className="btn btn-warning mt-10">
                  Save User
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
