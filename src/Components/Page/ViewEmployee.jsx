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

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/view-emplyee/${id}`);
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
        <main style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
          <h2 className="mb-4">Employee Details</h2>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-danger">Error: {error}</p>
          ) : employee ? (
            <div className="card p-4 shadow" style={{ maxWidth: '600px' }}>
              {employee.image && (
                <div style={{ marginBottom: '15px' }}>
                  <img
                    src={`http://127.0.0.1:8000/${employee.image}`}
                    alt="Employee"
                    style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
                  />
                </div>
              )}
              <p><strong>ID:</strong> {employee.id}</p>
              <p><strong>Name:</strong> {employee.first_name} {employee.last_name}</p>
              <p><strong>Phone:</strong> {employee.phone}</p>
              <p><strong>Status:</strong> {employee.status}</p>
              <p><strong>Email:</strong> {employee.email}</p>
              <p><strong>Gender:</strong> {employee.gender}</p>
              <p><strong>Date of Birth:</strong> {employee.date_of_birth}</p>
              <p><strong>Department:</strong> {employee.department?.name || 'N/A'}</p>
              <p><strong>Designation:</strong> {employee.designation?.name || 'N/A'}</p>
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
