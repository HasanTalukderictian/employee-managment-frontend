import { useEffect, useState } from "react";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/api/get-users`;
      if (searchQuery.trim()) url += `?search=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(url);
      const result = await response.json();
      setUsers(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [searchQuery]);

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/del-users/${userToDelete}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setUsers(users.filter((user) => user.id !== userToDelete));
      toast.success("User removed successfully");
    } catch (err) {
      toast.error("Error deleting user");
    } finally {
      setUserToDelete(null);
    }
  };

  const handleSearch = () => setSearchQuery(searchTerm.trim());

  const currentUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "1890px", height: "1024px", margin: "0 auto", boxSizing: "border-box" }}>
      <Toaster position="top-right" />
      <Header />
      <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: "40px", background: "#f4f7f6", overflowY: "auto" }}>
          <div style={{ background: "#ffffff", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", padding: "40px", minHeight: "85vh" }}>
            
            {/* Top Action Bar */}
            <div className="row align-items-center mb-5">
              <div className="col-md-8">
                {/* 🎨 উন্নত সার্চ ইনপুট ফিল্ড */}
                <div className="input-group" style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.05)", borderRadius: "12px", overflow: "hidden" }}>
                  <span className="input-group-text bg-white border-0 ps-4">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 py-3 shadow-none"
                    placeholder="Search by name, email or designation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    style={{ fontSize: "15px", background: "#fff" }}
                  />
                  <button 
                    className="btn btn-primary px-5 fw-bold" 
                    onClick={handleSearch}
                    style={{ transition: "0.3s" }}
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="col-md-4 text-end">
                <Link to="/admin-add-users">
                  <button className="btn btn-success py-3 px-4 fw-bold shadow-sm" style={{ borderRadius: "12px" }}>
                    <i className="bi bi-plus-lg me-2"></i>New Employee
                  </button>
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : (
              <>
                <div className="table-responsive" style={{ border: "1px solid #f0f0f0", borderRadius: "15px" }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ backgroundColor: "#fafafa", borderBottom: "2px solid #f0f0f0" }}>
                      <tr>
                        <th className="ps-4 py-3 text-muted fw-bold">EMPLOYEE</th>
                        <th className="text-center py-3 text-muted fw-bold">DESIGNATION</th>
                        <th className="text-center py-3 text-muted fw-bold">EMAIL</th>
                        <th className="pe-4 text-end py-3 text-muted fw-bold">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => (
                        <tr key={user.id} style={{ transition: "0.2s" }}>
                          <td className="ps-4 py-4 fw-bold text-dark">
                            {user.employee ? `${user.employee.first_name} ${user.employee.last_name}` : "N/A"}
                          </td>
                          <td className="text-center">
                            <span className="badge bg-soft-primary text-primary px-3 py-2" style={{ backgroundColor: "#eef2ff", borderRadius: "8px" }}>
                              {user.employee?.designation?.name ?? "N/A"}
                            </span>
                          </td>
                          <td className="text-center text-secondary">{user.email}</td>
                          <td className="pe-4 text-end">
                            <button 
                              className="btn btn-outline-danger btn-sm border-0" 
                              onClick={() => setUserToDelete(user.id)}
                              style={{ padding: "8px 12px", borderRadius: "8px", background: "#fff5f5" }}
                            >
                              <i className="bi bi-trash3"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 d-flex justify-content-center">
                   <nav>
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                        <button className="page-link border-0 shadow-none text-dark" onClick={() => setCurrentPage(v => v - 1)}>Prev</button>
                      </li>
                      {[...Array(Math.ceil(users.length / itemsPerPage))].map((_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                          <button className="page-link border-0 mx-1 rounded shadow-sm" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === Math.ceil(users.length / itemsPerPage) && 'disabled'}`}>
                        <button className="page-link border-0 shadow-none text-dark" onClick={() => setCurrentPage(v => v + 1)}>Next</button>
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

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(5px)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow" style={{ borderRadius: "20px" }}>
              <div className="modal-body text-center p-5">
                <div className="mb-3">
                    <i className="bi bi-exclamation-octagon text-danger" style={{ fontSize: "4rem" }}></i>
                </div>
                <h4 className="fw-bold">Are you sure?</h4>
                <p className="text-muted">You won't be able to revert this employee's data!</p>
                <div className="mt-4">
                  <button className="btn btn-light px-4 me-2 py-2" onClick={() => setUserToDelete(null)}>Cancel</button>
                  <button className="btn btn-danger px-4 py-2" onClick={confirmDelete}>Confirm Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;