import React, { useEffect, useState } from 'react'
import Header from './Header'
import Menu from './Menu'
import Footer from './Footer'
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

const Salary = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; 
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null); // ইউজারের আইডি ট্র্যাক করার জন্য

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const theme = {
    bg: darkMode ? '#0f172a' : '#f4f7f6',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f8fafc' : '#2d3436',
    border: darkMode ? '#334155' : '#e2e8f0',
    tableHeaderBg: darkMode ? '#334155' : '#2d3436',
    tableRowHover: darkMode ? '#1e293b' : '#f8fafc',
    muted: darkMode ? '#94a3b8' : '#64748b',
    inputBg: darkMode ? '#0f172a' : '#ffffff',
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/api/get-salary`;
      if (searchQuery.trim()) url += `?search=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url);
      const result = await response.json();
      setEmployees(Array.isArray(result.data) ? result.data : []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRole(localStorage.getItem('userRole'));
    // লগইন করা ইউজারের আইডি স্টোরেজ থেকে নেওয়া (ধরি 'userId' কি-তে আছে)
    setUserId(localStorage.getItem('employeeId')); 
    fetchEmployees();
  }, [searchQuery]);

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("authToken");
    const loadingToast = toast.loading("Deleting...");
    try {
      await fetch(`${BASE_URL}/api/del-salary/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted!", { id: loadingToast });
      fetchEmployees();
    } catch (err) {
      toast.error("Error!", { id: loadingToast });
    } finally {
      setShowModal(false);
    }
  };

  // ফিল্টারিং লজিক: ইউজার হলে শুধু তার ডাটা দেখাবে, এডমিন হলে সব।

const filteredEmployees = employees.filter(emp => {
  // ১. ইউজার রেস্ট্রিকশন (Role Based)
  // String এ কনভার্ট করে চেক করা হচ্ছে যাতে টাইপ নিয়ে সমস্যা না হয়
  const isOwner = role === 'admin' ? true : String(emp.employee_id) === String(userId);
  
  // ২. সার্চ ফিল্টার (নাম দিয়ে সার্চ)
  const fullName = `${emp.employee?.first_name} ${emp.employee?.last_name}`.toLowerCase();
  const matchesSearch = fullName.includes(searchTerm.toLowerCase());
  
  // ৩. ড্রপডাউন ফিল্টার (Month & Year)
  // API তে month ফিল্ডটি "January" ফরম্যাটে আছে এবং year ফিল্ডটি আলাদা আছে
  const matchesMonth = filterMonth ? emp.month === filterMonth : true;
  const matchesYear = filterYear ? String(emp.year) === String(filterYear) : true;
  
  return isOwner && matchesSearch && matchesMonth && matchesYear;
});

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', background: theme.bg, transition: '0.3s' }}>
      <Toaster position="top-right" />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        
        <main style={{ flexGrow: 1, padding: '20px' }}>
          <div style={{ 
            background: theme.cardBg, 
            borderRadius: "12px", 
            padding: "25px", 
            border: `1px solid ${theme.border}`,
            color: theme.text,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div className="d-flex gap-2 flex-grow-1" style={{ maxWidth: '700px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Employee name..."
                  style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => setSearchQuery(searchTerm)}>Search</button>
                
                <select 
                  className="form-select" 
                  style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}`, width: '150px' }}
                  onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">All Months</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>

                <select 
                  className="form-select" 
                  style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}`, width: '120px' }}
                  onChange={(e) => { setFilterYear(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">Year</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>

              {/* এডমিন না হলে Add Salary বাটনটি হাইড/ডিজেবল থাকবে */}
              {role === 'admin' && (
                <Link to="/admin-add-salary">
                  <button className="btn btn-success px-4">+ Add Salary</button>
                </Link>
              )}
            </div>

            <div className="table-responsive" style={{ borderRadius: '8px', border: `1px solid ${theme.border}` }}>
              <table className="table mb-0" style={{ color: theme.text, verticalAlign: 'middle' }}>
                <thead style={{ background: theme.tableHeaderBg, color: '#fff' }}>
                  <tr>
                    <th className="text-center py-3 border-0">Employee Name</th>
                    <th className="text-center py-3 border-0">Designation</th>
                    <th className="text-center py-3 border-0">Net Salary</th>
                    <th className="text-center py-3 border-0">Month</th>
                    <th className="text-center py-3 border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.length > 0 ? currentEmployees.map((salary) => (
                    <tr key={salary.id} style={{ borderBottom: `1px solid ${theme.border}`, transition: '0.2s' }}>
                      <td className="text-center py-3 fw-bold" style={{ background: 'transparent', color: theme.text }}>
                        {salary.employee?.first_name} {salary.employee?.last_name}
                      </td>
                      <td className="text-center py-3" style={{ background: 'transparent', color: theme.muted }}>
                        {salary.employee?.designation_id}
                      </td>
                      <td className="text-center py-3 fw-bold text-success" style={{ background: 'transparent' }}>
                        ৳ {(parseFloat(salary.basic) + parseFloat(salary.bonus) - parseFloat(salary.deductions)).toLocaleString()}
                      </td>
                      <td className="text-center py-3" style={{ background: 'transparent' }}>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">{salary.month}</span>
                      </td>
                      <td className="text-center py-3" style={{ background: 'transparent' }}>
                        {role === 'admin' && (
                          <button className="btn btn-sm btn-outline-danger border-0" onClick={() => openDeleteModal(salary.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="text-center py-4">No records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end align-items-center mt-4 gap-2">
                <span style={{ fontSize: '14px', color: theme.muted }}>
                  Showing {currentEmployees.length} of {filteredEmployees.length} records
                </span>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        style={{ background: theme.cardBg, color: theme.text, border: `1px solid ${theme.border}` }}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      >
                        Previous
                      </button>
                    </li>
                    <li className="page-item active">
                      <span className="page-link" style={{ background: '#0d6efd', border: 'none' }}>{currentPage}</span>
                    </li>
                    <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        style={{ background: theme.cardBg, color: theme.text, border: `1px solid ${theme.border}` }}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
            </div>
          </div>
        </main>
      </div>
      <Footer darkMode={darkMode} />
{/* Delete Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
          <div style={{ background: theme.cardBg, padding: '30px', borderRadius: '15px', maxWidth: '400px', width: '90%', textAlign: 'center', border: `1px solid ${theme.border}` }}>
            <h4 style={{ color: theme.text }}>Confirm Delete</h4>
            <p style={{ color: theme.muted }}>Are you sure you want to remove this record?</p>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button className="btn btn-secondary px-4" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-danger px-4" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Salary;

