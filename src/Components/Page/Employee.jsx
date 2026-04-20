import { useEffect, useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Employee = () => {
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

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/api/get-emplyee`;
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
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Delete failed");
        fetchEmployees();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // --- Pagination Logic (Fixed) ---
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '1890px', height: '1024px', margin: '0 auto', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: "30px", overflowY: "auto", background: "#f1f5f9" }}>
          
          {/* Main Card */}
          <div style={{ 
            background: "#ffffff", 
            borderRadius: "20px", 
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)", 
            padding: "30px", 
            minHeight: "100%", 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* Action Row */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div style={{ position: 'relative', width: '45%' }}>
                <i className="bi bi-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search employees..."
                  value={searchTerm}
                  style={{ paddingLeft: '45px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '48px' }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setSearchQuery(searchTerm.trim())}
                />
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-primary" style={{ borderRadius: '10px', padding: '10px 20px', backgroundColor: '#10b981', border: 'none', fontWeight: '600' }} onClick={() => setSearchQuery(searchTerm.trim())}>
                  Run Filter
                </button>
                <Link to="/admin-add-employee">
                  <button className="btn btn-dark" style={{ borderRadius: '10px', padding: '10px 20px', fontWeight: '600' }}>
                    <i className="bi bi-plus-lg me-2"></i>Add Employee
                  </button>
                </Link>
                <button className="btn btn-outline-success" style={{ borderRadius: '10px', padding: '10px 20px', fontWeight: '600' }} onClick={handleDownloadExcel}>
                  <i className="bi bi-file-earmark-excel me-2"></i>Export Excel
                </button>
              </div>
            </div>

            {/* Table Area */}
            {loading ? (
              <div className="text-center p-5"><div className="spinner-border text-success" role="status"></div></div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <div className="table-responsive" style={{ borderRadius: '15px', border: '1px solid #f1f5f9', flexGrow: 1 }}>
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: '#f8fafc' }}>
                    <tr style={{ fontSize: '13px', color: '#64748b', letterSpacing: '0.5px' }}>
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
                        <tr key={employee.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td className="px-4 py-3">
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '38px', height: '38px', background: '#ecfdf5', color: '#10b981', fontWeight: '700' }}>
                                {employee.first_name[0]}
                              </div>
                              <span style={{ fontWeight: '600', color: '#1e293b' }}>{employee.first_name}</span>
                            </div>
                          </td>
                          <td className="text-center text-muted">{employee.phone}</td>
                          <td className="text-center">
                            <span style={{ 
                              padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                              background: employee.status === 'Active' ? '#dcfce7' : '#fee2e2',
                              color: employee.status === 'Active' ? '#15803d' : '#b91c1c'
                            }}>
                              {employee.status}
                            </span>
                          </td>
                          <td className="text-center"><span className="badge bg-light text-dark border-0" style={{ padding: '6px 10px' }}>{employee.department?.name}</span></td>
                          <td className="text-center text-muted">{employee.designation?.name}</td>
                          <td className="text-end px-4">
                            <div className="btn-group shadow-sm rounded-3 overflow-hidden">
                              <button className="btn btn-light btn-sm border-end" onClick={() => navigate(`/employee/view/${employee.id}`)}><i className="bi bi-eye text-primary"></i></button>
                              {role?.toLowerCase() === 'admin' && (
                                <>
                                  <button className="btn btn-light btn-sm border-end" onClick={() => navigate(`/employee/edit/${employee.id}`)}><i className="bi bi-pencil text-success"></i></button>
                                  <button className="btn btn-light btn-sm" onClick={() => handleDelete(employee.id)}><i className="bi bi-trash text-danger"></i></button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="text-center p-5 text-muted">No employees found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center mt-auto pt-4">
              <p className="text-muted small mb-0">
                Showing <b>{indexOfFirstItem + 1}</b> to <b>{Math.min(indexOfLastItem, employees.length)}</b> of <b>{employees.length}</b> employees
              </p>
              <nav>
                <ul className="pagination pagination-sm mb-0 gap-1">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link rounded-3 border-0" style={{ background: '#f1f5f9', color: '#1e293b' }} onClick={() => setCurrentPage(currentPage - 1)}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                      <button 
                        className="page-link rounded-3 border-0 mx-1" 
                        style={{ 
                          width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: currentPage === i + 1 ? '#10b981' : '#f1f5f9',
                          color: currentPage === i + 1 ? '#fff' : '#1e293b'
                        }} 
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link rounded-3 border-0" style={{ background: '#f1f5f9', color: '#1e293b' }} onClick={() => setCurrentPage(currentPage + 1)}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Employee;