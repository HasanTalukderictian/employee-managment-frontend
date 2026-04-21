import React, { useEffect, useState } from 'react'
import Header from './Header'
import Menu from './Menu'
import Footer from './Footer'
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast' // Toast Import

const Salary = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [role, setRole] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/api/get-salary`;
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
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
    fetchEmployees();
  }, [searchQuery]);

  // ডিলিট কনফার্ম করার প্রসেস
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("authToken");
    const loadingToast = toast.loading("Deleting salary record...");

    try {
      const response = await fetch(`${BASE_URL}/api/del-salary/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Delete failed");
      
      toast.success("Salary record deleted successfully!", { id: loadingToast });
      fetchEmployees();
    } catch (error) {
      toast.error("Delete failed: " + error.message, { id: loadingToast });
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const handleSearch = () => setSearchQuery(searchTerm.trim());
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '1890px', height: '1024px', margin: '0 auto', boxSizing: 'border-box' }}>
      <Toaster position="top-right" />
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: '40px', background: '#f4f7f6', overflowY: 'auto' }}>
          
          <div style={{ background: "#ffffff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", padding: "30px", minHeight: "85vh", position: "relative" }}>
            
            {/* Search & Add Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex" style={{ width: '75%' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by employee name..."
                  value={searchTerm}
                  style={{ borderRadius: '10px 0 0 10px', padding: '12px' }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="btn btn-primary" style={{ borderRadius: '0 10px 10px 0', padding: '0 25px' }} onClick={handleSearch}>
                  <i className="bi bi-search"></i> Search
                </button>
              </div>
          
              <Link to="/admin-add-salary">
                <button className="btn btn-success" style={{ padding: '12px 25px', borderRadius: '10px', fontWeight: '600' }}>
                  + Add Salary
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center my-5">
                 <div className="spinner-border text-primary" role="status"></div>
                 <p className="mt-2">Loading Salaries...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">Error: {error}</div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover" style={{ border: '1px solid #eee' }}>
                    <thead style={{ backgroundColor: '#2d3436', color: '#fff' }}>
                      <tr>
                        <th className="text-center py-3">Employee Name</th>
                        <th className="text-center py-3">Designation ID</th>
                        <th className="text-center py-3">Total Salary</th>
                        <th className="text-center py-3">Month</th>
                        <th className="text-center py-3">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentEmployees.length > 0 ? (
                        currentEmployees.map((salary) => (
                          <tr key={salary.id} style={{ verticalAlign: 'middle' }}>
                            <td className="text-center fw-bold">{salary.employee.first_name} {salary.employee.last_name}</td>
                            <td className="text-center text-muted">{salary.employee.designation_id}</td>
                            <td className="text-center fw-bold text-success">
                              ৳ {(parseFloat(salary.basic) + parseFloat(salary.bonus) - parseFloat(salary.deductions)).toLocaleString()}
                            </td>
                            <td className="text-center"><span className="badge bg-info text-dark">{salary.month}</span></td>
                            <td className="text-center">
                              {role === 'admin' && (
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  style={{ borderRadius: '8px', padding: '5px 15px' }}
                                  onClick={() => openDeleteModal(salary.id)}
                                >
                                  <i className="bi bi-trash"></i> Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="5" className="text-center py-5 text-muted">No salary records found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div style={{ position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)" }}>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                          <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <Footer />

      {/* --- CUSTOM DELETE MODAL --- */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#fff', padding: '40px', borderRadius: '20px',
            width: '450px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '60px', color: '#ff4d4d', marginBottom: '10px' }}>
               <i className="bi bi-exclamation-octagon"></i>
            </div>
            <h3 style={{ fontWeight: '700' }}>Confirm Delete</h3>
            <p className="text-muted">Are you sure you want to delete this salary record? This process cannot be undone.</p>
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button className="btn btn-light" style={{ padding: '10px 30px', borderRadius: '10px', border: '1px solid #ddd' }} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" style={{ padding: '10px 30px', borderRadius: '10px' }} onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Salary