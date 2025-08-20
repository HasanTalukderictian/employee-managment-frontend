import React, { useState, useEffect } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';

const Leave = () => {
  const [showModal, setShowModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [totalLeave, setTotalLeave] = useState('');
  const [leaveBalances, setLeaveBalances] = useState([]);

  const [role, setRole] = useState(null);

  // Apply Leave form states
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const [leaveRequests, setLeaveRequests] = useState([]);


  useEffect(() => {
    // Leave Balances
    fetch('http://127.0.0.1:8000/api/get-leaves')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setLeaveBalances(data);
        } else if (data && Array.isArray(data.data)) {
          setLeaveBalances(data.data);
        }
      });

    // Leave Requests (for admin)
    fetch('http://127.0.0.1:8000/api/my-leave-requests')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setLeaveRequests(data);
        } else if (data && Array.isArray(data.data)) {
          setLeaveRequests(data.data);
        }
      });
  }, []);

  // Approve Leave Request
  const handleApprove = (id) => {
    fetch(`http://127.0.0.1:8000/api/leave-requests/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then(() => {
        setLeaveRequests((prev) => prev.filter((req) => req.id !== id));
      });
  };

  // Reject Leave Request
  const handleReject = (id) => {
    fetch(`http://127.0.0.1:8000/api/leave-requests/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then(() => {
        setLeaveRequests((prev) => prev.filter((req) => req.id !== id));
      });
  };

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

  // Handle Add Leave (Admin)
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


  // Handle Apply Leave (User)
  const handleApplySubmit = (e) => {
  e.preventDefault();

  const applyData = {
    employee_id: selectedEmployee || 1,
    leave_type: leaveType,
    start_date: startDate,
    end_date: endDate,
    reason: reason,
  };

  fetch('http://127.0.0.1:8000/api/apply-leave', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(applyData),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Leave applied:", data);

      setShowApplyModal(false);
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');

      // ✅ Refresh leave requests table for admin
      fetch('http://127.0.0.1:8000/api/get-apply-leave')
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data)) setLeaveRequests(data);
          else if (data && Array.isArray(data.data)) setLeaveRequests(data.data);
        });
    })
    .catch((err) => console.error('Error applying leave:', err));
};



  // Fetch leave requests for admin
useEffect(() => {
  if (role === 'admin') {
    fetch('http://127.0.0.1:8000/api/get-apply-leave')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setLeaveRequests(data);
        } else if (data && Array.isArray(data.data)) {
          setLeaveRequests(data.data);
        }
      })
      .catch((err) => console.error('Error fetching leave requests:', err));
  }
}, [role]);




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
                  onClick={() => setShowApplyModal(true)}
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
                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Leave Requests Table (Admin Only) */}
            {role === 'admin' && (
              <div className="mt-5">
                <h3>User Leave Requests</h3>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th className="text-center h6">Employee</th>
                        <th className="text-center h6">Leave Type</th>
                        <th className="text-center h6">Start Date</th>
                        <th className="text-center h6">End Date</th>
                        <th className="text-center h6">Reason</th>
                        <th className="text-center h6">Status</th>
                        <th className="text-center h6">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.length > 0 ? (
                        leaveRequests.map((req) => (
                          <tr key={req.id}>
                            <td className="text-center">
                              {req.employee?.first_name} {req.employee?.last_name}
                            </td>
                            <td className="text-center">{req.leave_type}</td>
                            <td className="text-center">{req.start_date}</td>
                            <td className="text-center">{req.end_date}</td>
                            <td className="text-center">{req.reason}</td>
                            <td className="text-center">{req.status}</td>
                            <td className="text-center">
                              {req.status === 'pending' && (
                                <>
                                  <button
                                    className="btn btn-success btn-sm me-2"
                                    onClick={() => handleApprove(req.id)}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleReject(req.id)}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">No leave requests found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
      <Footer />

      {/* Modal for Add Leave (Admin) */}
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

      {/* Modal for Apply Leave (User) */}
      {showApplyModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Apply for Leave</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowApplyModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleApplySubmit}>
                  {/* Leave Type */}
                  <div className="mb-3">
                    <label className="form-label">Leave Type</label>
                    <select
                      className="form-select"
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      required
                    >
                      <option value="">Select Leave Type</option>
                      <option value="Paid">Casual Leave</option>
                      <option value="Unpaid">Sick Leave</option>
                    </select>
                  </div>

                  {/* Start Date */}
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* End Date */}
                  <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Reason */}
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <textarea
                      className="form-control"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setShowApplyModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit
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
