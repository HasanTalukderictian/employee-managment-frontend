import { useEffect, useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const Department = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const BASE_URL = import.meta.env.VITE_BASE_URL;

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

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You are not authorized. Please log in again.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/del-dept/${id}`, {
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

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '1890px', height: '1024px', margin: '0 auto', border: '1px solid #ccc', boxSizing: 'border-box' }}>
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: "30px", background: "#f8f9fa", overflowY: "auto" }}>

          <div style={{ background: "#ffffff", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", padding: "30px", minHeight: "85vh", position: "relative" }}>

            {/* Page Title */}
            <div className="mb-4">
              <h4 style={{ fontWeight: "700", color: "#2c3e50" }}>Department Management</h4>
              <p className="text-muted small">Manage and organize all your company departments here.</p>
            </div>

            {/* Top Bar: Search & Add */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3" style={{ background: "#f1f4f9", borderRadius: "12px" }}>
              <div className="d-flex" style={{ width: "60%" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search department by name..."
                  value={searchTerm}
                  style={{ borderRadius: "8px 0 0 8px", border: "1px solid #ddd", padding: "12px" }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") setSearchQuery(searchTerm.trim()) }}
                />
                <button
                  className="btn btn-primary"
                  style={{ borderRadius: "0 8px 8px 0", padding: "0 25px" }}
                  onClick={() => setSearchQuery(searchTerm.trim())}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>

              <Link to="/admin-add-department" style={{ textDecoration: 'none' }}>
                <button
                  className="btn btn-success d-flex align-items-center"
                  style={{
                    padding: "12px 25px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    boxShadow: "0 4px 12px rgba(40, 167, 69, 0.2)"
                  }}
                >
                  <i className="bi bi-plus-lg me-2"></i> Add New Department
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2">Fetching data...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger" style={{ borderRadius: "10px" }}>
                <i className="bi bi-exclamation-triangle me-2"></i> Error: {error}
              </div>
            ) : (
              <>
                <div className="table-responsive" style={{ borderRadius: "10px", border: "1px solid #eee" }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ background: "#2c3e50", color: "#fff" }}>
                      <tr>
                        <th className="py-3 px-4" style={{ width: "80%" }}>Department Name</th>
                        <th className="py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEmployees.length > 0 ? (
                        currentEmployees.map((dept) => (
                          <tr key={dept.id} style={{ transition: "0.3s" }}>
                            <td className="px-4">
                              <div className="d-flex align-items-center">
                                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a73e8", fontWeight: "bold", marginRight: "15px" }}>
                                  {dept.name.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontWeight: "600", color: "#444", fontSize: "16px" }}>{dept.name}</span>
                              </div>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                style={{ borderRadius: "6px", padding: "6px 15px", transition: "0.3s" }}
                                onClick={() => handleDelete(dept.id)}
                              >
                                <i className="bi bi-trash3 me-1"></i> Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center py-5 text-muted">
                            <i className="bi bi-folder-x display-4 d-block mb-2"></i>
                            No departments found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Modern Pagination */}
                <div style={{ position: "absolute", bottom: "30px", left: "50%", transform: "translateX(-50%)" }}>
                  <nav>
                    <ul className="pagination mb-0" style={{ gap: "5px" }}>
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link border-0 shadow-sm" style={{ borderRadius: "8px", padding: "10px 15px" }} onClick={() => setCurrentPage(currentPage - 1)}>
                          <i className="bi bi-chevron-left"></i>
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                          <button
                            className="page-link border-0 shadow-sm"
                            style={{ borderRadius: "8px", padding: "10px 18px", fontWeight: "600" }}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link border-0 shadow-sm" style={{ borderRadius: "8px", padding: "10px 15px" }} onClick={() => setCurrentPage(currentPage + 1)}>
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
      <Footer />
    </div>
  );
};

export default Department;