import React, { useEffect, useState } from 'react'
import Header from './Header'
import Menu from './Menu'
import Footer from './Footer'
import { Link } from 'react-router-dom'

const Salary = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({ visible: false, content: '', x: 0, y: 0 });

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
      const employeeData = result.data;
      setEmployees(Array.isArray(employeeData) ? employeeData : []);
      setCurrentPage(1);
    } catch (error) {
      setError(error.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    // Read role on mount
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [searchQuery]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You are not authorized. Please log in again.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/del-salary/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Delete failed");
        fetchEmployees();
      } catch (error) {
        alert("Delete failed: " + error.message);
      }
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  const showToast = (content, event) => {
    setToast({
      visible: true,
      content,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const hideToast = () => {
    setToast({ visible: false, content: '', x: 0, y: 0 });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '1890px',
        margin: '0 auto',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
      }}
    >
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              padding: "30px",
              minHeight: "90vh",
              paddingBottom: "100px",
              position: "relative",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search name"
                value={searchTerm}
                style={{ width: "78%" }}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="btn btn-primary ms-2" onClick={handleSearch}>
                <i className="bi bi-search me-1"></i> Search
              </button>
              {role === 'admin' && (
              <Link to="/admin-add-salary" className="ms-2">
                <button className="btn btn-success">Add Salary</button>
              </Link>
              )}
            </div>

            {loading ? (
              <div className="text-center my-4">Loading...</div>
            ) : error ? (
              <div className="text-danger">Error: {error}</div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th className="text-center h6">Name</th>
                        <th className="text-center h6">Designation ID</th>
                        <th className="text-center h6">Salary</th>
                        <th className="text-center h6">Salary Month</th>
                        <th className="text-center h6">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentEmployees.length > 0 ? (
                        currentEmployees.map((salary) => (
                          <tr key={salary.id}>
                            <td className="text-center h6">
                              {salary.employee.first_name} {salary.employee.last_name}
                            </td>
                            <td className="text-center h6">
                              {salary.employee.designation_id /* Replace with actual designation name */}
                            </td>
                            <td
                              className="text-center h6"
                              onMouseEnter={(e) =>
                                showToast(
                                  `Basic: ৳${salary.basic}\nBonus: ৳${salary.bonus}\nDeductions: ৳${salary.deductions}`,
                                  e
                                )
                              }
                              onMouseLeave={hideToast}
                            >
                              ৳{" "}
                              {(
                                parseFloat(salary.basic) +
                                parseFloat(salary.bonus) -
                                parseFloat(salary.deductions)
                              ).toFixed(2)}
                            </td>

                            <td className="text-center h6">
                              {salary.month}
                            </td>
                            <td className="text-center">
                              {role === 'admin' && (
                              <button
                                className="btn btn-danger btn-sm d-flex align-items-center justify-content-center mx-auto"
                                onClick={() => handleDelete(salary.id)}
                              >
                                
                                <i className="bi bi-trash me-1"></i> Delete
                              </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No salaries found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Fixed Pagination */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={handlePrevPage}>
                          <i className="bi bi-chevron-left"></i>
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <li
                          key={i + 1}
                          className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                        >
                          <button className="page-link" onClick={() => handlePageClick(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={handleNextPage}>
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </>
            )}

            {/* Toast */}
            {toast.visible && (
              <div
                style={{
                  position: 'fixed',
                  top: toast.y + 10,
                  left: toast.x + 10,
                  backgroundColor: 'rgba(0,0,0,0.75)',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  whiteSpace: 'pre-line',
                  pointerEvents: 'none',
                  zIndex: 9999,
                  fontSize: '0.9rem',
                  maxWidth: '200px',
                }}
              >
                {toast.content}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Salary
