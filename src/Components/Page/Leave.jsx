import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast'; // Import Toast
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
  const [leaveRequests, setLeaveRequests] = useState([]); 

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
  }, []);

  // Fetch employees & leave balances
  useEffect(() => {
    fetch(`${BASE_URL}/api/get-emplyee`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) setEmployees(data.data);
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

  // Fetch leave requests
  useEffect(() => {
    if (!role) return;
    const endpoint = role === 'admin' ? `${BASE_URL}/api/get-apply-leave` : `${BASE_URL}/api/my-leaves`;
    
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) setLeaveRequests(data);
        else if (data && Array.isArray(data.data)) setLeaveRequests(data.data);
      })
      .catch((err) => console.error('Error fetching leave requests:', err));
  }, [role]);

  const handleApprove = (id) => {
    fetch(`${BASE_URL}/api/leave-requests/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then(() => {
        setLeaveRequests((prev) => prev.filter((req) => req.id !== id));
        toast.success('Leave Approved Successfully');
      })
      .catch(() => toast.error('Approval Failed'));
  };

  const handleReject = (id) => {
    fetch(`${BASE_URL}/api/leave-requests/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    })
      .then((res) => res.json())
      .then(() => {
        setLeaveRequests((prev) => prev.filter((req) => req.id !== id));
        toast.error('Leave Request Rejected');
      })
      .catch(() => toast.error('Rejection Failed'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${BASE_URL}/api/add-leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ employee_id: selectedEmployee, total_leave: parseInt(totalLeave, 10) }),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success('Leave Balance Added');
        // Refresh balances
        fetch(`${BASE_URL}/api/get-leaves`).then(res => res.json()).then(data => {
            if (data && Array.isArray(data)) setLeaveBalances(data);
            else if (data && Array.isArray(data.data)) setLeaveBalances(data.data);
        });
        setShowModal(false);
        setSelectedEmployee('');
        setTotalLeave('');
      })
      .catch(() => toast.error('Failed to save leave balance'));
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Employee ID is missing! Please login again.");
      return;
    }

    const applyData = { employee_id: userId, leave_type: leaveType, start_date: startDate, end_date: endDate, reason };

    fetch(`${BASE_URL}/api/apply-leave`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(applyData),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success('Leave Applied Successfully!');
        setShowApplyModal(false);
        setLeaveType(''); setStartDate(''); setEndDate(''); setReason('');
        // Refresh lists
        fetch(`${BASE_URL}/api/my-leaves?employee_id=${userId}`).then(res => res.json()).then(data => {
            if (data && Array.isArray(data)) setLeaveRequests(data);
            else if (data && Array.isArray(data.data)) setLeaveRequests(data.data);
        });
      })
      .catch(() => toast.error('Error applying for leave'));
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    const colors = {
      pending: '#f39c12',
      approved: '#2ecc71',
      rejected: '#e74c3c'
    };
    return (
      <span style={{ 
        backgroundColor: colors[status.toLowerCase()] || '#95a5a6', 
        color: '#fff', padding: '5px 12px', borderRadius: '20px', 
        fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize' 
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '1890px', margin: '0 auto', boxSizing: 'border-box', backgroundColor: '#f4f7f6' }}>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: '30px', overflowY: 'auto' }}>
          <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '35px', position: 'relative', minHeight: '85vh' }}>
            
            {/* Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontWeight: '800', color: '#2c3e50', margin: 0 }}>Leave Management</h2>
              {role === 'admin' ? (
                <button className="btn" style={{ backgroundColor: '#27ae60', color: '#fff', borderRadius: '8px', padding: '10px 25px', fontWeight: 'bold' }} onClick={() => setShowModal(true)}>+ Add Leave Balance</button>
              ) : (
                <button className="btn" style={{ backgroundColor: '#3498db', color: '#fff', borderRadius: '8px', padding: '10px 25px', fontWeight: 'bold' }} onClick={() => setShowApplyModal(true)}>Apply for Leave</button>
              )}
            </div>

            {/* Leave Balance Section */}
            <div className="section-title mb-3" style={{ borderLeft: '5px solid #2c3e50', paddingLeft: '15px' }}>
                <h5 style={{ margin: 0, fontWeight: '700' }}>Leave Balances</h5>
            </div>
            <div className="table-responsive mb-5" style={{ borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
              <table className="table table-hover mb-0">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    <th className="text-center">Employee Name</th>
                    <th className="text-center">Total Allotted</th>
                    <th className="text-center">Taken</th>
                    <th className="text-center">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveBalances.map((leave) => (
                    <tr key={`${leave.employee_id}-${leave.created_at}`} style={{ verticalAlign: 'middle' }}>
                      <td className="text-center fw-bold">{leave.employee?.first_name} {leave.employee?.last_name}</td>
                      <td className="text-center">{leave.total_leave}</td>
                      <td className="text-center text-danger">{leave.taken_leave}</td>
                      <td className="text-center text-success fw-bold">{leave.remaining_leave}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Leave Requests Section */}
            <div className="section-title mb-3" style={{ borderLeft: '5px solid #3498db', paddingLeft: '15px' }}>
                <h5 style={{ margin: 0, fontWeight: '700' }}>{role === 'admin' ? 'Recent User Requests' : 'My Leave History'}</h5>
            </div>
            <div className="table-responsive" style={{ borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
              <table className="table table-hover mb-0">
                <thead style={{ backgroundColor: '#f8f9fa' }}>
                  <tr>
                    {role === 'admin' && <th className="text-center">Employee</th>}
                    <th className="text-center">Type</th>
                    <th className="text-center">Start Date</th>
                    <th className="text-center">End Date</th>
                    <th className="text-center">Reason</th>
                    <th className="text-center">Status</th>
                    {role === 'admin' && <th className="text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.length > 0 ? leaveRequests.map((req) => (
                    <tr key={req.id} style={{ verticalAlign: 'middle' }}>
                      {role === 'admin' && <td className="text-center fw-bold">{req.employee?.first_name} {req.employee?.last_name}</td>}
                      <td className="text-center">{req.leave_type}</td>
                      <td className="text-center">{req.start_date}</td>
                      <td className="text-center">{req.end_date}</td>
                      <td className="text-center" style={{ maxWidth: '200px', fontSize: '14px', color: '#666' }}>{req.reason}</td>
                      <td className="text-center">{getStatusBadge(req.status)}</td>
                      {role === 'admin' && (
                        <td className="text-center">
                          {req.status === 'pending' ? (
                            <div className="btn-group">
                              <button className="btn btn-success btn-sm" onClick={() => handleApprove(req.id)}>Approve</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleReject(req.id)}>Reject</button>
                            </div>
                          ) : (
                            <span className="text-muted small">Processed</span>
                          )}
                        </td>
                      )}
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={role === 'admin' ? "7" : "5"} className="text-center py-4 text-muted">No leave requests found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
      <Footer />

      {/* Modern Styled Modal for Add Leave */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '15px', border: 'none', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid #eee' }}>
                <h5 className="modal-title fw-bold">Update Leave Balance</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Select Employee</label>
                    <select className="form-select" style={{ padding: '10px' }} value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} required>
                      <option value="">Select Employee</option>
                      {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Total Leave Quota</label>
                    <input type="number" className="form-control" style={{ padding: '10px' }} placeholder="Enter number of days" value={totalLeave} onChange={(e) => setTotalLeave(e.target.value)} required />
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: 'none' }}>
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modern Styled Modal for Apply Leave */}
      {showApplyModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '15px', border: 'none' }}>
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Apply for Leave</h5>
                <button type="button" className="btn-close" onClick={() => setShowApplyModal(false)}></button>
              </div>
              <form onSubmit={handleApplySubmit}>
                <div className="modal-body p-4">
                  <div className="row">
                    <div className="col-12 mb-3">
                        <label className="form-label fw-bold">Leave Type</label>
                        <select className="form-select" value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                          <option value="">Select Category</option>
                          <option value="Paid">Casual Leave</option>
                          <option value="Unpaid">Sick Leave</option>
                        </select>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">From</label>
                        <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">To</label>
                        <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                    </div>
                    <div className="col-12 mb-2">
                        <label className="form-label fw-bold">Reason for Leave</label>
                        <textarea className="form-control" placeholder="Briefly describe your reason..." value={reason} onChange={(e) => setReason(e.target.value)} rows="3" required></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowApplyModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-5" style={{ borderRadius: '8px' }}>Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;