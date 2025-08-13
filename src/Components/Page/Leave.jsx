import React, { useState, useEffect } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';

const Leave = () => {
  const [showModal, setShowModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [totalLeave, setTotalLeave] = useState('');
  const [leaveBalances, setLeaveBalances] = useState([]);

  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    console.log('storedRole from localStorage:', storedRole);
    setRole(storedRole);
  }, []);


  // Fetch employees & leave balances on mount
  useEffect(() => {
    // Employees
    fetch('http://127.0.0.1:8000/api/get-emplyee')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setEmployees(data.data);
        }
      })
      .catch((err) => console.error('Error fetching employees:', err));

    // Leave Balances
    fetch('http://127.0.0.1:8000/api/get-leaves')
      .then((res) => res.json())
      .then((data) => {
        console.log('Leave API Response:', data); // Debug
        if (data && Array.isArray(data)) {
          setLeaveBalances(data);
        } else if (data && Array.isArray(data.data)) {
          setLeaveBalances(data.data);
        }
      })
      .catch((err) => console.error('Error fetching leave balances:', err));
  }, []);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://127.0.0.1:8000/api/add-leaves', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        employee_id: selectedEmployee,
        total_leave: parseInt(totalLeave, 10),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Leave set:', data);

        // Refresh leave balances after adding new one
        fetch('http://127.0.0.1:8000/api/get-leaves')
          .then((res) => res.json())
          .then((data) => {
            if (data && Array.isArray(data)) {
              setLeaveBalances(data);
            } else if (data && Array.isArray(data.data)) {
              setLeaveBalances(data.data);
            }
          });

        setShowModal(false);
        setSelectedEmployee('');
        setTotalLeave('');
      })
      .catch((err) => console.error('Error saving leave balance:', err));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '1890px',
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
            background: '#f0eee7',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              padding: '30px',
              position: 'relative',
              minHeight: '90vh',
              paddingBottom: '100px',
            }}
          >
            {/* Header Row */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <h1 className="text-center mb-0" style={{ fontWeight: 'bold' }}>
                Leave Management
              </h1>

              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  gap: '10px'
                }}
              >
                {role === 'admin' && (
                  <button
                    className="btn btn-success"
                    onClick={() => setShowModal(true)}
                  >
                    Add Leave
                  </button>
                )}

                <button
                  className="btn btn-primary"
                  onClick={() => setShowModal(true)}
                  disabled={role === 'admin'} // disable if admin
                >
                  Apply
                </button>
              </div>


            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th className="text-center h6">Name</th>
                    <th className="text-center h6">Total Leave</th>
                    <th className="text-center h6">Taken Leave</th>
                    <th className="text-center h6">Remaining</th>
                    <th className="text-center h6">Leave Type</th>
                    <th className="text-center h6">Request</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveBalances.map((leave) => (
                    <tr key={`${leave.employee_id}-${leave.created_at}`}>
                      <td className="text-center">
                        {leave.employee.first_name} {leave.employee.last_name}
                      </td>
                      <td className="text-center">{leave.total_leave}</td>
                      <td className="text-center">{leave.taken_leave}</td>
                      <td className="text-center">{leave.remaining_leave}</td>
                      <td className="text-center">{leave.leave_type}</td>
                      <td className="text-center">
                        <button className="btn btn-primary btn-sm">Request</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <Footer />

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Leave</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Employee Dropdown */}
                  <div className="mb-3">
                    <label className="form-label">Employee Name</label>
                    <select
                      className="form-select"
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Total Leave */}
                  <div className="mb-3">
                    <label className="form-label">Total Leave</label>
                    <input
                      type="number"
                      className="form-control"
                      value={totalLeave}
                      onChange={(e) => setTotalLeave(e.target.value)}
                      required
                    />
                  </div>

                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
