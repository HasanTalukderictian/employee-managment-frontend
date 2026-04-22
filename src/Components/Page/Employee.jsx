import { useEffect, useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Employee = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [role, setRole] = useState(null);

  // থিম ডাইনামিক কালারস
  const theme = {
    bg: darkMode ? '#0f172a' : '#f1f5f9',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f8fafc' : '#1e293b',
    border: darkMode ? '#334155' : '#e2e8f0',
    tableHeader: darkMode ? '#0f172a' : '#f8fafc',
    muted: darkMode ? '#94a3b8' : '#64748b',
    inputBg: darkMode ? '#0f172a' : '#fff'
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/api/get-employee`;
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

  const handleDownloadExcel = () => {
    const dataToExport = employees.map(emp => ({
      Name: emp.first_name,
      Phone: emp.phone,
      Status: emp.status,
      Department: emp.department?.name,
      Designation: emp.designation?.name,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'employees.xlsx');
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) return alert("Unauthorized!");
    
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/del-employee/${id}`, {
          method: "DELETE",
          headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json" 
          },
        });
        if (!response.ok) throw new Error("Delete failed");
        fetchEmployees();
        alert("Employee deleted successfully!");
      } catch (error) {
        alert(error.message);
      }
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
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        
        <main style={{ flexGrow: 1, padding: "30px", width: '100%', transition: 'all 0.4s ease' }}>
          
          <div style={{ 
            background: theme.cardBg, 
            borderRadius: "24px", 
            boxShadow: darkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 25px rgba(0,0,0,0.05)", 
            padding: "30px", 
            minHeight: "100%", 
            border: `1px solid ${theme.border}`,
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease'
          }}>
            
            {/* Search and Action Buttons */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              <div style={{ position: 'relative', minWidth: '300px', flex: '1' }}>
                <i className="bi bi-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: theme.muted }}></i>
                <input
                  type="text"
                  className="form-control shadow-sm"
                  placeholder="Search employees..."
                  value={searchTerm}
                  style={{ 
                    paddingLeft: '45px', 
                    borderRadius: '14px', 
                    background: theme.inputBg,
                    border: `1px solid ${theme.border}`, 
                    color: theme.text,
                    height: '50px' 
                  }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setSearchQuery(searchTerm.trim())}
                />
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-primary shadow-sm" style={{ borderRadius: '12px', padding: '10px 24px', backgroundColor: '#10b981', border: 'none', fontWeight: '600' }} onClick={() => setSearchQuery(searchTerm.trim())}>
                  Filter
                </button>
                <Link to="/admin-add-employee">
                  <button className="btn shadow-sm" style={{ borderRadius: '12px', padding: '10px 24px', fontWeight: '600', backgroundColor: darkMode ? '#334155' : '#1e293b', color: '#fff' }}>
                    <i className="bi bi-plus-lg me-2"></i>Add Employee
                  </button>
                </Link>
                <button className="btn btn-outline-success shadow-sm" style={{ borderRadius: '12px', padding: '10px 24px', fontWeight: '600' }} onClick={handleDownloadExcel}>
                  <i className="bi bi-file-earmark-excel me-2"></i>Export
                </button>
              </div>
            </div>

            {/* Table Area */}
            {loading ? (
              <div className="text-center p-5"><div className="spinner-border text-success" role="status"></div></div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <div className="table-responsive" style={{ borderRadius: '18px', border: `1px solid ${theme.border}`, flexGrow: 1, overflow: 'hidden' }}>
                <table className="table table-hover align-middle mb-0" style={{ color: theme.text, background: 'transparent' }}>
                  <thead style={{ background: theme.tableHeader }}>
                    <tr style={{ fontSize: '13px', color: theme.muted, letterSpacing: '0.5px', borderBottom: `1px solid ${theme.border}` }}>
                      <th className="px-4 py-3 border-0">NAME</th>
                      <th className="text-center py-3 border-0">CONTACT</th>
                      <th className="text-center py-3 border-0">STATUS</th>
                      <th className="text-center py-3 border-0">DEPARTMENT</th>
                      <th className="text-center py-3 border-0">DESIGNATION</th>
                      <th className="text-end px-4 py-3 border-0">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmployees.length > 0 ? (
                      currentEmployees.map((employee) => (
                        <tr key={employee.id} style={{ 
                          borderBottom: `1px solid ${theme.border}`,
                          backgroundColor: theme.cardBg, // ডার্ক মোডে সাদা ভাব দূর করবে
                          transition: 'background 0.3s'
                        }}>
                          <td className="px-4 py-3" style={{ background: 'transparent', color: theme.text }}>
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '40px', height: '40px', background: darkMode ? '#0f172a' : '#ecfdf5', color: '#10b981', fontWeight: '700' }}>
                                {employee.first_name ? employee.first_name[0] : 'E'}
                              </div>
                              <span style={{ fontWeight: '600' }}>{employee.first_name}</span>
                            </div>
                          </td>
                          <td className="text-center small" style={{ background: 'transparent', color: theme.muted }}>{employee.phone}</td>
                          <td className="text-center" style={{ background: 'transparent' }}>
                            <span style={{ 
                              padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                              background: employee.status === 'Active' ? (darkMode ? '#064e3b' : '#dcfce7') : (darkMode ? '#7f1d1d' : '#fee2e2'),
                              color: employee.status === 'Active' ? (darkMode ? '#34d399' : '#15803d') : (darkMode ? '#f87171' : '#b91c1c')
                            }}>
                              {employee.status}
                            </span>
                          </td>
                          <td className="text-center" style={{ background: 'transparent' }}>
                            <span className="badge" style={{ 
                              padding: '7px 12px', fontWeight: '500', borderRadius: '8px',
                              background: darkMode ? '#334155' : '#f1f5f9', color: theme.text
                            }}>
                              {employee.department?.name}
                            </span>
                          </td>
                          <td className="text-center small" style={{ background: 'transparent', color: theme.muted }}>{employee.designation?.name}</td>
                          <td className="text-end px-4" style={{ background: 'transparent' }}>
                            <div className={`btn-group shadow-sm rounded-3 overflow-hidden border ${darkMode ? 'border-secondary' : ''}`}>
                              <button className={`btn btn-sm ${darkMode ? 'btn-dark' : 'btn-white'}`} style={{ border: 'none' }} onClick={() => navigate(`/employee/view/${employee.id}`)}>
                                <i className="bi bi-eye text-primary"></i>
                              </button>
                              <button className={`btn btn-sm border-start ${darkMode ? 'btn-dark border-secondary' : 'btn-white'}`} style={{ border: 'none' }} onClick={() => navigate(`/employee/edit/${employee.id}`)}>
                                <i className="bi bi-pencil text-success"></i>
                              </button>
                              <button className={`btn btn-sm border-start ${darkMode ? 'btn-dark border-secondary' : 'btn-white'}`} style={{ border: 'none' }} onClick={() => handleDelete(employee.id)}>
                                <i className="bi bi-trash text-danger"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="text-center p-5" style={{ background: theme.cardBg, color: theme.muted }}>No employees found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mt-auto pt-4 gap-2">
              <p className="small mb-0" style={{ color: theme.muted }}>
                Showing <b>{indexOfFirstItem + 1}</b> to <b>{Math.min(indexOfLastItem, employees.length)}</b> of <b>{employees.length}</b>
              </p>
              <nav>
                <ul className="pagination pagination-sm mb-0 gap-1">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link rounded-3 border-0 shadow-sm" style={{ background: theme.tableHeader, color: theme.text }} onClick={() => setCurrentPage(currentPage - 1)}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                      <button 
                        className="page-link rounded-3 border-0 mx-1 shadow-sm" 
                        style={{ 
                          width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: currentPage === i + 1 ? '#10b981' : theme.tableHeader,
                          color: currentPage === i + 1 ? '#fff' : theme.text
                        }} 
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link rounded-3 border-0 shadow-sm" style={{ background: theme.tableHeader, color: theme.text }} onClick={() => setCurrentPage(currentPage + 1)}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </main>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Employee;