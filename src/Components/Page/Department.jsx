import { useEffect, useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Department = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // থিম ডাইনামিক কালারস
  const theme = {
    bg: darkMode ? '#0f172a' : '#f1f5f9',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f8fafc' : '#1e293b',
    border: darkMode ? '#334155' : '#e2e8f0',
    tableHeader: darkMode ? '#0f172a' : '#2c3e50',
    muted: darkMode ? '#94a3b8' : '#64748b',
    inputArea: darkMode ? '#1e293b' : '#f1f4f9',
    inputField: darkMode ? '#0f172a' : '#ffffff'
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/api/get-dept`;
      if (searchQuery.trim()) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setEmployees(Array.isArray(result.data) ? result.data : []);
      setCurrentPage(1);
    } catch (error) {
      setError(error.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [searchQuery]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("You are not authorized. Please log in.");
      setShowModal(false);
      return;
    }

    const loadingToast = toast.loading("Deleting department...");
    
    try {
      const response = await fetch(`${BASE_URL}/api/del-dept/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Delete failed");
      
      toast.success("Department deleted successfully!", { id: loadingToast });
      setShowModal(false);
      fetchEmployees();
    } catch (error) {
      toast.error("Delete failed: " + error.message, { id: loadingToast });
    }
  };

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      minHeight: '100vh', 
      background: theme.bg,
      transition: 'all 0.3s ease'
    }}>
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Custom Confirmation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: theme.cardBg, padding: '30px', borderRadius: '20px',
            width: '90%', maxWidth: '400px', textAlign: 'center', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: `1px solid ${theme.border}`
          }}>
            <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3.5rem' }}></i>
            <h3 className="mt-3" style={{ fontWeight: '700', color: theme.text }}>Are you sure?</h3>
            <p style={{ color: theme.muted }}>You won't be able to revert this department data!</p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className={`btn ${darkMode ? 'btn-outline-light' : 'btn-secondary'} px-4`} style={{ borderRadius: '10px' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-danger px-4" style={{ borderRadius: '10px' }} onClick={confirmDelete}>Yes, Delete it!</button>
            </div>
          </div>
        </div>
      )}

      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        
        <main style={{ 
          flexGrow: 1, 
          padding: "25px", 
          background: theme.bg, 
          overflowY: "auto",
          transition: 'all 0.4s ease'
        }}>

          <div style={{ 
            background: theme.cardBg, 
            borderRadius: "20px", 
            boxShadow: darkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.05)", 
            padding: "30px", 
            minHeight: "85vh", 
            border: `1px solid ${theme.border}`,
            transition: 'all 0.3s ease'
          }}>

            <div className="mb-4">
              <h4 style={{ fontWeight: "700", color: theme.text }}>Department Management</h4>
              <p style={{ color: theme.muted, fontSize: '14px' }}>Manage and organize all your company departments here.</p>
            </div>

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-3 gap-3" style={{ background: theme.inputArea, borderRadius: "14px" }}>
              <div className="d-flex flex-grow-1" style={{ minWidth: "250px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search department..."
                  value={searchTerm}
                  style={{ 
                    borderRadius: "10px 0 0 10px", 
                    border: `1px solid ${theme.border}`, 
                    padding: "12px",
                    background: theme.inputField,
                    color: theme.text
                  }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") setSearchQuery(searchTerm.trim()) }}
                />
                <button
                  className="btn btn-primary"
                  style={{ borderRadius: "0 10px 10px 0", padding: "0 25px", backgroundColor: '#10b981', border: 'none' }}
                  onClick={() => setSearchQuery(searchTerm.trim())}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>

              <Link to="/admin-add-department" className="w-sm-100" style={{ textDecoration: 'none' }}>
                <button
                  className="btn btn-success d-flex align-items-center justify-content-center w-100"
                  style={{
                    padding: "12px 25px",
                    borderRadius: "10px",
                    fontWeight: "600",
                    backgroundColor: darkMode ? '#334155' : '#1e293b',
                    border: 'none',
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                >
                  <i className="bi bi-plus-lg me-2"></i> Add New
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-success" role="status"></div>
                <p className="mt-2" style={{ color: theme.muted }}>Fetching data...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger shadow-sm" style={{ borderRadius: "12px" }}>
                <i className="bi bi-exclamation-triangle me-2"></i> Error: {error}
              </div>
            ) : (
              <>
                <div className="table-responsive" style={{ borderRadius: "12px", border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
                  <table className="table table-hover align-middle mb-0" style={{ color: theme.text }}>
                    <thead style={{ background: theme.tableHeader, color: "#fff" }}>
                      <tr>
                        <th className="py-3 px-4 border-0">Department Name</th>
                        <th className="py-3 text-center border-0">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEmployees.length > 0 ? (
                        currentEmployees.map((dept) => (
                          <tr key={dept.id} style={{ borderBottom: `1px solid ${theme.border}`, background: theme.cardBg }}>
                            <td className="px-4 py-3" style={{ background: 'transparent' }}>
                              <div className="d-flex align-items-center">
                                <div style={{ 
                                  width: "38px", height: "38px", borderRadius: "10px", 
                                  background: darkMode ? "#0f172a" : "#e8f0fe", 
                                  display: "flex", alignItems: "center", justifyContent: "center", 
                                  color: "#10b981", fontWeight: "bold", marginRight: "12px" 
                                }}>
                                  {dept.name.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontWeight: "600", color: theme.text }}>{dept.name}</span>
                              </div>
                            </td>
                            <td className="text-center" style={{ background: 'transparent' }}>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                style={{ borderRadius: "8px", padding: "6px 15px", fontWeight: '500' }}
                                onClick={() => handleDeleteClick(dept.id)}
                              >
                                <i className="bi bi-trash3 me-1"></i> <span className="d-none d-md-inline">Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr style={{ background: theme.cardBg }}>
                          <td colSpan="2" className="text-center py-5" style={{ color: theme.muted }}>
                            <i className="bi bi-folder-x display-4 d-block mb-2"></i>
                            No departments found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-center mt-5 pb-3">
                  <nav>
                    <ul className="pagination mb-0" style={{ gap: "8px" }}>
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button 
                          className="page-link border-0 shadow-sm" 
                          style={{ borderRadius: "10px", background: theme.inputArea, color: theme.text }} 
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          <i className="bi bi-chevron-left"></i>
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                          <button
                            className="page-link border-0 shadow-sm"
                            style={{ 
                              borderRadius: "10px", fontWeight: "600", width: '40px', height: '40px',
                              background: currentPage === i + 1 ? '#10b981' : theme.inputArea,
                              color: currentPage === i + 1 ? '#fff' : theme.text
                            }}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button 
                          className="page-link border-0 shadow-sm" 
                          style={{ borderRadius: "10px", background: theme.inputArea, color: theme.text }} 
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Department;