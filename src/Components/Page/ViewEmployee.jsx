import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';

const ViewEmployee = () => {
  const { id } = useParams();
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
        console.log('API Response:', result);

        if (result && (result.data || result.employee)) {
          setEmployee(result.data || result.employee);
        } else {
          throw new Error('Unexpected response structure');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  return (
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
        <main
          style={{
            flexGrow: 1,
            padding: '40px',
            background: 'linear-gradient(to bottom right, #ffffff, #f0eee7)',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.05)',
            minHeight: '100vh',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
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
                   Employee Details
                </h3>
              </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-danger">Error: {error}</p>
          ) : employee ? (
            <div
              style={{
                display: 'flex',
                gap: '40px',
                flexWrap: 'wrap',
                alignItems: 'stretch',
              }}
            >
              {/* Left - Image */}
              <div
                className="card shadow"
                style={{
                  width: '40%',
                  minWidth: '280px',
                  border: 'none',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                }}
              >
                {employee.profile_picture && (
                  <img
                    src={`${BASE_URL}/${employee.profile_picture}`}
                    alt="Employee"
                    style={{
                      width: '100%',
                      height: '350px',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </div>

              {/* Right - Details */}
              <div
                className="card shadow p-4"
                style={{
                  width: '55%',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  textAlign: 'left'
                }}
              >
                <p className="h5 mb-3">
                  <strong>Name:</strong> {employee.first_name} {employee.last_name}
                </p>
                <p className="h5 mb-3">
                  <strong>Contact Number:</strong> {employee.phone}
                </p>
                <p className="h5 mb-3">
                  <strong>Email:</strong> {employee.email}
                </p>
                <p className="h5 mb-3">
                  <strong>Status:</strong> {employee.status}
                </p>
                <p className="h5 mb-3">
                  <strong>Gender:</strong> {employee.gender}
                </p>
                <p className="h5 mb-3">
                  <strong>Date of Birth:</strong> {employee.date_of_birth}
                </p>
                <p className="h5 mb-3">
                  <strong>Department:</strong> {employee.department?.name || 'N/A'}
                </p>
                <p className="h5 mb-0">
                  <strong>Designation:</strong> {employee.designation?.name || 'N/A'}
                </p>
              </div>
            </div>
          ) : (
            <p>No employee data found.</p>
          )}
        </main>


      </div>
      <Footer />
    </div>
  );
};

export default ViewEmployee;
