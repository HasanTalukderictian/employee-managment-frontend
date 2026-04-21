import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast'; 
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';

const Leave = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
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

  // Theme configuration
  const theme = {
    bg: darkMode ? '#0f172a' : '#f4f7f6',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f8fafc' : '#2c3e50',
    border: darkMode ? '#334155' : '#eee',
    tableHeaderBg: darkMode ? '#334155' : '#f8f9fa',
    muted: darkMode ? '#94a3b8' : '#666',
    inputBg: darkMode ? '#1e293b' : '#ffffff',
  };

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
        fetch(`${BASE_URL}/api/my-leaves?employee_id=${userId}`).then(res => res.json()).then(data => {
            if (data && Array.isArray(data)) setLeaveRequests(data);
            else if (data && Array.isArray(data.data)) setLeaveRequests(data.data);
        });
      })
      .catch(() => toast.error('Error applying for leave'));
  };

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

  // Reusable Table Component for clean UI
  const TableHeader = ({ children }) => (
    <thead style={{ backgroundColor: theme.tableHeaderBg }}>
      <tr>{children}</tr>
    </thead>
  );

  const TableCell = ({ children, isBold, color, align = 'center' }) => (
    <td style={{ 
      padding: '15px', 
      textAlign: align, 
      color: color || theme.text, 
      fontWeight: isBold ? 'bold' : 'normal',
      borderBottom: `1px solid ${theme.border}`,
      backgroundColor: 'transparent' // Force transparent
    }}>
      {children}
    </td>
  );

  const TableHeadCell = ({ children }) => (
    <th style={{ 
      padding: '15px', 
      textAlign: 'center', 
      color: theme.text, 
      borderBottom: `1px solid ${theme.border}`,
      backgroundColor: 'transparent',
      fontWeight: '700'
    }}>
      {children}
    </th>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: theme.bg, transition: '0.3s ease' }}>
      <Toaster position="top-right" reverseOrder={false} />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        <main style={{ flexGrow: 1, padding: '30px', overflowY: 'auto' }}>
          <div style={{ 
            background: theme.cardBg, 
            borderRadius: '20px', 
            boxShadow: darkMode ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.05)', 
            padding: '35px', 
            border: `1px solid ${theme.border}`,
            color: theme.text 
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontWeight: '800', margin: 0 }}>Leave Management</h2>
              {role === 'admin' ? (
                <button className="btn" style={{ backgroundColor: '#27ae60', color: '#fff', borderRadius: '8px', padding: '10px 25px', fontWeight: 'bold' }} onClick={() => setShowModal(true)}>+ Add Leave Balance</button>
              ) : (
                <button className="btn" style={{ backgroundColor: '#3498db', color: '#fff', borderRadius: '8px', padding: '10px 25px', fontWeight: 'bold' }} onClick={() => setShowApplyModal(true)}>Apply for Leave</button>
              )}
            </div>

            {/* Balances */}
            <div className="section-title mb-3" style={{ borderLeft: `5px solid ${darkMode ? '#3498db' : '#2c3e50'}`, paddingLeft: '15px' }}>
                <h5 style={{ margin: 0, fontWeight: '700' }}>Leave Balances</h5>
            </div>
            <div className="table-responsive mb-5" style={{ borderRadius: '12px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'transparent' }}>
                <TableHeader>
                  <TableHeadCell>Employee Name</TableHeadCell>
                  <TableHeadCell>Total Allotted</TableHeadCell>
                  <TableHeadCell>Taken</TableHeadCell>
                  <TableHeadCell>Remaining</TableHeadCell>
                </TableHeader>
                <tbody>
                  {leaveBalances.map((leave) => (
                    <tr key={`${leave.employee_id}-${leave.created_at}`}>
                      <TableCell isBold>{leave.employee?.first_name} {leave.employee?.last_name}</TableCell>
                      <TableCell>{leave.total_leave}</TableCell>
                      <TableCell color="#e74c3c">{leave.taken_leave}</TableCell>
                      <TableCell color="#2ecc71" isBold>{leave.remaining_leave}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Requests */}
            <div className="section-title mb-3" style={{ borderLeft: '5px solid #3498db', paddingLeft: '15px' }}>
                <h5 style={{ margin: 0, fontWeight: '700' }}>{role === 'admin' ? 'Recent User Requests' : 'My Leave History'}</h5>
            </div>
            <div className="table-responsive" style={{ borderRadius: '12px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'transparent' }}>
                <TableHeader>
                  {role === 'admin' && <TableHeadCell>Employee</TableHeadCell>}
                  <TableHeadCell>Type</TableHeadCell>
                  <TableHeadCell>Start Date</TableHeadCell>
                  <TableHeadCell>End Date</TableHeadCell>
                  <TableHeadCell>Reason</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  {role === 'admin' && <TableHeadCell>Actions</TableHeadCell>}
                </TableHeader>
                <tbody>
                  {leaveRequests.length > 0 ? leaveRequests.map((req) => (
                    <tr key={req.id}>
                      {role === 'admin' && <TableCell isBold>{req.employee?.first_name} {req.employee?.last_name}</TableCell>}
                      <TableCell>{req.leave_type}</TableCell>
                      <TableCell>{req.start_date}</TableCell>
                      <TableCell>{req.end_date}</TableCell>
                      <TableCell align="center">
                        <div style={{ maxWidth: '200px', fontSize: '13px', color: theme.muted, margin: '0 auto' }}>{req.reason}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      {role === 'admin' && (
                        <TableCell>
                          {req.status === 'pending' ? (
                            <div className="btn-group">
                              <button className="btn btn-success btn-sm me-1" onClick={() => handleApprove(req.id)}>Approve</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleReject(req.id)}>Reject</button>
                            </div>
                          ) : (
                            <span style={{ color: theme.muted, fontSize: '12px' }}>Processed</span>
                          )}
                        </TableCell>
                      )}
                    </tr>
                  )) : (
                    <tr><TableCell colSpan="10" color={theme.muted}>No requests found</TableCell></tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
      <Footer darkMode={darkMode} />

      {/* Modals are kept with same theme fix */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ background: theme.cardBg, color: theme.text, border: `1px solid ${theme.border}` }}>
              <div className="modal-header" style={{ borderBottom: `1px solid ${theme.border}` }}>
                <h5 className="modal-title fw-bold">Update Balance</h5>
                <button type="button" className="btn-close" style={{ filter: darkMode ? 'invert(1)' : 'none' }} onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                    <label className="fw-bold mb-1">Select Employee</label>
                    <select className="form-select mb-3" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} required>
                      <option value="" style={{ background: theme.cardBg }}>Select One</option>
                      {employees.map((emp) => <option key={emp.id} value={emp.id} style={{ background: theme.cardBg }}>{emp.first_name} {emp.last_name}</option>)}
                    </select>
                    <label className="fw-bold mb-1">Total Days</label>
                    <input type="number" className="form-control" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} value={totalLeave} onChange={(e) => setTotalLeave(e.target.value)} required />
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showApplyModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ background: theme.cardBg, color: theme.text, border: `1px solid ${theme.border}` }}>
              <div className="modal-header" style={{ borderBottom: `1px solid ${theme.border}` }}>
                <h5 className="modal-title fw-bold">Apply Leave</h5>
                <button type="button" className="btn-close" style={{ filter: darkMode ? 'invert(1)' : 'none' }} onClick={() => setShowApplyModal(false)}></button>
              </div>
              <form onSubmit={handleApplySubmit}>
                <div className="modal-body p-4">
                    <div className="mb-3">
                        <label className="fw-bold">Type</label>
                        <select className="form-select" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                          <option value="" style={{ background: theme.cardBg }}>Select Category</option>
                          <option value="Paid" style={{ background: theme.cardBg }}>Casual Leave</option>
                          <option value="Unpaid" style={{ background: theme.cardBg }}>Sick Leave</option>
                        </select>
                    </div>
                    <div className="row mb-3">
                        <div className="col"><label className="fw-bold">From</label><input type="date" className="form-control" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></div>
                        <div className="col"><label className="fw-bold">To</label><input type="date" className="form-control" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} value={endDate} onChange={(e) => setEndDate(e.target.value)} required /></div>
                    </div>
                    <label className="fw-bold">Reason</label>
                    <textarea className="form-control" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }} value={reason} onChange={(e) => setReason(e.target.value)} rows="3" required></textarea>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Submit</button>
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