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

  const userId = localStorage.getItem('employeeId');

  const [leaveRequests, setLeaveRequests] = useState([]); // admin OR user requests

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
  }, []);

  // Fetch employees & leave balances on mount
  useEffect(() => {
    fetch(`${BASE_URL}/api/get-emplyee`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setEmployees(data.data);
        }
      })
      .catch((err) => console.error('Error fetching employees:', err));

    fetch(`${BASE_URL}/api/get-leaves`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) setLeaveBalances(data);
        else if (data && Array.isArray(data.data)) setLeaveBalances(data.data);
      })
      .catch((err) => console.error('Error fetching leave balances:', err));
  }, []);

  // Fetch leave requests (admin or user)
  useEffect(() => {
    if (role === 'admin') {
      fetch(`${BASE_URL}/api/get-apply-leave`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data)) setLeaveRequests(data);
          else if (data && Array.isArray(data.data)) setLeaveRequests(data.data);
        })
        .catch((err) => console.error('Error fetching leave requests:', err));
    } else {
      // For regular users: fetch only their own leave requests
      fetch(`${BASE_URL}/api/my-leaves`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data)) setLeaveRequests(data);
          else if (data && Array.isArray(data.data)) setLeaveRequests(data.data);
        })
        .catch((err) => console.error('Error fetching user leave requests:', err));
    }
  }, [role]);

  // Approve Leave Request
  const handleApprove = (id) => {
    fetch(`${BASE_URL}/api/leave-requests/${id}/approve`, {
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
    fetch(`${BASE_URL}/api/leave-requests/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then(() => {
        setLeaveRequests((prev) => prev.filter((req) => req.id !== id));
      });
  };

  // Handle Add Leave (Admin)
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${BASE_URL}/api/add-leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ employee_id: selectedEmployee, total_leave: parseInt(totalLeave, 10) }),
    })
      .then((res) => res.json())
      .then(() => {
        fetch('${BASE_URL}/api/get-leaves')
          .then((res) => res.json())
          .then((data) => {
            if (data && Array.isArray(data)) setLeaveBalances(data);
            else if (data && Array.isArray(data.data)) setLeaveBalances(data.data);
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

    if (!userId) {
      console.error("Employee ID is missing!");
      alert("Your session is missing employee ID. Please login again.");
      return;
    }

    const applyData = {
      employee_id: userId, // must be valid
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason,
    };

    fetch(`${BASE_URL}/api/apply-leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(applyData),
    })
      .then((res) => res.json())
      .then(() => {
        setShowApplyModal(false);
        setLeaveType('');
        setStartDate('');
        setEndDate('');
        setReason('');
        // Refresh user leave requests
        // Fetch only current user's leaves
        
        if (userId) {
          fetch(`${BASE_URL}/api/my-leaves?employee_id=${userId}`)
            .then((res) => res.json())
            .then((data) => {
              if (data && Array.isArray(data)) setLeaveRequests(data);
              else if (data && Array.isArray(data.data)) setLeaveRequests(data.data);
            })
            .catch((err) => console.error('Error fetching user leave requests:', err));
        } else {
          console.error('No employeeId found in localStorage');
        }


      })
      .catch((err) => console.error('Error applying leave:', err));
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '1890px', margin: '0 auto', border: '1px solid #ccc', boxSizing: 'border-box' }}>
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: '40px', background: '#f0eee7', overflowY: 'auto' }}>
          <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '30px', position: 'relative', minHeight: '90vh', paddingBottom: '100px' }}>
            {/* Header Row */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <h1 className="text-center mb-0" style={{ fontWeight: 'bold' }}>Leave Management</h1>
              <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '10px' }}>
                {role === 'admin' ? (
                  <button className="btn btn-success" onClick={() => setShowModal(true)}>Add Leave</button>
                ) : (
                  <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>Apply</button>
                )}
              </div>
            </div>

            {/* Leave Balance Table */}
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th className="text-center h6">Name</th>
                    <th className="text-center h6">Total Leave</th>
                    <th className="text-center h6">Taken Leave</th>
                    <th className="text-center h6">Remaining</th>
                    <th className="text-center h6">Request</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveBalances.map((leave) => (
                    <tr key={`${leave.employee_id}-${leave.created_at}`}>
                      <td className="text-center">{leave.employee.first_name} {leave.employee.last_name}</td>
                      <td className="text-center">{leave.total_leave}</td>
                      <td className="text-center">{leave.taken_leave}</td>
                      <td className="text-center">{leave.remaining_leave}</td>
                      <td className="text-center"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Leave Requests Table (Admin or User) */}
            <div className="mt-5">
              <h3>{role === 'admin' ? 'User Leave Requests' : 'My Leave Requests'}</h3>
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="table-dark">
                    <tr>
                      {role === 'admin' && <th className="text-center h6">Employee</th>}
                      <th className="text-center h6">Leave Type</th>
                      <th className="text-center h6">Start Date</th>
                      <th className="text-center h6">End Date</th>
                      <th className="text-center h6">Reason</th>
                      <th className="text-center h6">Status</th>
                      {role === 'admin' && <th className="text-center h6">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.length > 0 ? leaveRequests.map((req) => (
                      <tr key={req.id}>
                        {role === 'admin' && <td className="text-center">{req.employee?.first_name} {req.employee?.last_name}</td>}
                        <td className="text-center">{req.leave_type}</td>
                        <td className="text-center">{req.start_date}</td>
                        <td className="text-center">{req.end_date}</td>
                        <td className="text-center">{req.reason}</td>
                        <td className="text-center">{req.status}</td>
                        {role === 'admin' && (
                          <td className="text-center">
                            {req.status === 'pending' && (
                              <>
                                <button className="btn btn-success btn-sm me-2" onClick={() => handleApprove(req.id)}>Approve</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleReject(req.id)}>Reject</button>
                              </>
                            )}
                          </td>
                        )}
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={role === 'admin' ? "7" : "5"} className="text-center">No leave requests found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
      <Footer />

      {/* Admin Add Leave Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Leave</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Employee Name</label>
                    <select className="form-select" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} required>
                      <option value="">Select Employee</option>
                      {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total Leave</label>
                    <input type="number" className="form-control" value={totalLeave} onChange={(e) => setTotalLeave(e.target.value)} required />
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Apply Leave Modal */}
      {showApplyModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Apply for Leave</h5>
                <button type="button" className="btn-close" onClick={() => setShowApplyModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleApplySubmit}>
                  <div className="mb-3">
                    <label className="form-label">Leave Type</label>
                    <select className="form-select" value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                      <option value="">Select Leave Type</option>
                      <option value="Paid">Casual Leave</option>
                      <option value="Unpaid">Sick Leave</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <textarea className="form-control" value={reason} onChange={(e) => setReason(e.target.value)} rows="3" required></textarea>
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowApplyModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Submit</button>
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
