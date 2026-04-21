import { useEffect, useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Department = () => {
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
    <div style={{ display: 'flex', flexDirection: 'column', width: '1890px', height: '1024px', margin: '0 auto', border: '1px solid #ccc', boxSizing: 'border-box', position: 'relative' }}>
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Custom Confirmation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 9999
        }}>
          <div style={{
            background: 'white', padding: '30px', borderRadius: '15px',
            width: '400px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3rem' }}></i>
            <h3 className="mt-3" style={{ fontWeight: '700' }}>Are you sure?</h3>
            <p className="text-muted">You won't be able to revert this department data!</p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button className="btn btn-secondary px-4" style={{ borderRadius: '8px' }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-danger px-4" style={{ borderRadius: '8px' }} onClick={confirmDelete}>Yes, Delete it!</button>
            </div>
          </div>
        </div>
      )}

      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: "30px", background: "#f8f9fa", overflowY: "auto" }}>

          <div style={{ background: "#ffffff", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", padding: "30px", minHeight: "85vh", position: "relative" }}>

            <div className="mb-4">
              <h4 style={{ fontWeight: "700", color: "#2c3e50" }}>Department Management</h4>
              <p className="text-muted small">Manage and organize all your company departments here.</p>
            </div>

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
                                onClick={() => handleDeleteClick(dept.id)}
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