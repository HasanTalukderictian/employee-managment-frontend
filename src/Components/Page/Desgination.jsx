import { useEffect, useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Desgination = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Sidebar width logic
  const sidebarWidth = isExpanded ? '260px' : '80px';

  // Strict Theme Configuration
  const theme = {
    bg: darkMode ? '#0f172a' : '#f8f9fa',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f8fafc' : '#1e293b',
    border: darkMode ? '#334155' : '#e2e8f0',
    tableHeader: darkMode ? '#0f172a' : '#f1f5f9',
    inputBg: darkMode ? '#0f172a' : '#ffffff',
    muted: darkMode ? '#94a3b8' : '#64748b'
  };

  useEffect(() => {
    setRole(localStorage.getItem('userRole'));
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        let url = `${BASE_URL}/api/get-desi`;
        if (searchQuery.trim()) {
          url += `?search=${encodeURIComponent(searchQuery)}`;
        }
        const response = await fetch(url);
        const result = await response.json();
        setEmployees(Array.isArray(result.data) ? result.data : []);
        setCurrentPage(1);
      } catch (error) {
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [searchQuery, BASE_URL]);

  const confirmDelete = async () => {
    const token = localStorage.getItem('authToken');
    const loadingToast = toast.loading("Deleting...");
    try {
      const response = await fetch(`${BASE_URL}/api/del-desi/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== deleteId));
        toast.success("Deleted successfully!", { id: loadingToast });
      }
    } catch (error) {
      toast.error('Delete failed', { id: loadingToast });
    } finally {
      setShowModal(false);
    }
  };

  const currentEmployees = employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      minHeight: '100vh', 
      background: theme.bg, 
      color: theme.text,
      transition: 'all 0.3s ease' 
    }}>
      <Toaster position="top-right" />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        
        <main style={{ 
          flexGrow: 1, 
          padding: '25px', 
          width: `calc(100% - ${sidebarWidth})`,
          transition: 'all 0.3s ease',
          overflowY: 'auto'
        }}>
          <div style={{ 
            background: theme.cardBg, 
            borderRadius: '20px', 
            padding: '30px', 
            border: `1px solid ${theme.border}`,
            boxShadow: darkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.05)',
            minHeight: '80vh'
          }}>
            
            {/* Action Bar */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <div className="d-flex" style={{ maxWidth: '450px', flexGrow: 1 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search designation..."
                  style={{ 
                    borderRadius: '12px 0 0 12px', 
                    background: theme.inputBg, 
                    color: theme.text, 
                    border: `1px solid ${theme.border}`,
                    padding: '12px'
                  }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  className="btn btn-primary px-4" 
                  style={{ borderRadius: '0 12px 12px 0' }}
                  onClick={() => setSearchQuery(searchTerm)}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
              <Link to="/admin-add-desgination">
                <button className="btn btn-success px-4 py-2" style={{ borderRadius: '12px', fontWeight: '700' }}>
                  <i className="bi bi-plus-lg me-2"></i> Add New
                </button>
              </Link>
            </div>

            {/* Table Area */}
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : (
              <div className="table-responsive" style={{ borderRadius: '15px' }}>
                <table className="table" style={{ color: theme.text, marginBottom: 0 }}>
                  <thead>
                    <tr style={{ background: theme.tableHeader }}>
                      <th style={{ 
                        padding: '20px', 
                        color: theme.text, 
                        borderBottom: `2px solid ${theme.border}`,
                        background: 'transparent' // Force transparent to show header bg
                      }}>Designation Name</th>
                      <th className="text-center" style={{ 
                        padding: '20px', 
                        color: theme.text, 
                        borderBottom: `2px solid ${theme.border}`,
                        background: 'transparent'
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmployees.length > 0 ? (
                      currentEmployees.map((item) => (
                        <tr key={item.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <td style={{ 
                            padding: '15px 20px', 
                            color: theme.text, 
                            background: 'transparent',
                            verticalAlign: 'middle'
                          }}>{item.name}</td>
                          <td className="text-center" style={{ padding: '15px 20px', background: 'transparent' }}>
                           
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                style={{ borderRadius: '8px', padding: '5px 15px' }}
                                onClick={() => { setDeleteId(item.id); setShowModal(true); }}
                              >
                                <i className="bi bi-trash3 me-1"></i> Delete
                              </button>
                           
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center py-5" style={{ color: theme.muted, background: 'transparent' }}>
                          No designations found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button 
                    key={i+1}
                    className={`btn ${currentPage === i+1 ? 'btn-primary' : ''}`}
                    style={{ 
                      borderRadius: '10px', 
                      background: currentPage === i+1 ? '#059669' : theme.inputBg,
                      color: currentPage === i+1 ? '#fff' : theme.text,
                      border: `1px solid ${theme.border}`,
                      minWidth: '40px'
                    }}
                    onClick={() => setCurrentPage(i+1)}
                  >
                    {i+1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer darkMode={darkMode} />

      {/* Delete Modal */}
      {showModal && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', 
          zIndex: 9999, backdropFilter: 'blur(4px)' 
        }}>
          <div style={{ 
            background: theme.cardBg, padding: '30px', borderRadius: '20px', 
            width: '350px', textAlign: 'center', border: `1px solid ${theme.border}`, 
            color: theme.text 
          }}>
            <i className="bi bi-exclamation-octagon text-danger" style={{ fontSize: '3rem' }}></i>
            <h4 className="mt-3 fw-bold">Are you sure?</h4>
            <p style={{ color: theme.muted }}>This action cannot be undone.</p>
            <div className="d-flex gap-3 mt-4">
              <button className="btn btn-light w-100" style={{ borderRadius: '10px' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-danger w-100" style={{ borderRadius: '10px' }} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Desgination;