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
  
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [role, setRole] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // ডাইনামিক থিম কনফিগারেশন
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
    fetchEmployees();
  }, [searchQuery]);

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

  const currentEmployees = employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            
            {/* Search & Add Bar */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div className="d-flex" style={{ maxWidth: '400px', width: '100%' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Employee name..."
                  style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => setSearchQuery(searchTerm)}>Search</button>
              </div>
              <Link to="/admin-add-salary">
                <button className="btn btn-success px-4">+ Add Salary</button>
              </Link>
            </div>

            {/* Table Section */}
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
                  {currentEmployees.map((salary) => (
                    <tr key={salary.id} style={{ borderBottom: `1px solid ${theme.border}`, transition: '0.2s' }}>
                      <td className="text-center py-3 fw-bold" style={{ background: 'transparent', color: theme.text }}>
                        {salary.employee.first_name} {salary.employee.last_name}
                      </td>
                      <td className="text-center py-3" style={{ background: 'transparent', color: theme.muted }}>
                        {salary.employee.designation_id}
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
                  ))}
                </tbody>
              </table>
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

export default Salary