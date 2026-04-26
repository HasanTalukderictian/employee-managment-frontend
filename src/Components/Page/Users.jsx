import { useEffect, useState } from "react";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Users = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Theme configuration
  const theme = {
    bg: darkMode ? "#0f172a" : "#f4f7f6",
    cardBg: darkMode ? "#1e293b" : "#ffffff",
    text: darkMode ? "#f8fafc" : "#2c3e50",
    border: darkMode ? "#334155" : "#f0f0f0",
    tableHeaderBg: darkMode ? "#334155" : "#fafafa",
    muted: darkMode ? "#94a3b8" : "#6c757d",
    inputBg: darkMode ? "#1e293b" : "#ffffff",
  };

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

  // Table Cell Component to ensure visibility
  const TableCell = ({ children, isBold, color, align = "left", ps }) => (
    <td style={{
      padding: "20px",
      textAlign: align,
      color: color || theme.text,
      fontWeight: isBold ? "bold" : "normal",
      borderBottom: `1px solid ${theme.border}`,
      backgroundColor: "transparent",
      paddingLeft: ps || "20px"
    }}>
      {children}
    </td>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh", backgroundColor: theme.bg, transition: "0.3s" }}>
      <Toaster position="top-right" />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

        <main style={{ flexGrow: 1, padding: "30px", overflowY: "auto" }}>
          <div style={{
            background: theme.cardBg,
            borderRadius: "20px",
            boxShadow: darkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 10px 40px rgba(0,0,0,0.05)",
            padding: "40px",
            minHeight: "85vh",
            border: `1px solid ${theme.border}`,
            color: theme.text
          }}>

            {/* Top Action Bar */}
            <div className="row align-items-center mb-5">
              <div className="col-md-8">
                <div className="input-group" style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.1)", borderRadius: "12px", overflow: "hidden", border: `1px solid ${theme.border}` }}>
                  <span className="input-group-text border-0 ps-4" style={{ background: theme.inputBg }}>
                    <i className={`bi bi-search ${darkMode ? 'text-light' : 'text-muted'}`}></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 py-3 shadow-none"
                    placeholder="Search by name, email or designation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    style={{ fontSize: "15px", background: theme.inputBg, color: theme.text }}
                  />
                  <button className="btn btn-primary px-5 fw-bold" onClick={handleSearch}>Search</button>
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
                <div className="table-responsive" style={{ border: `1px solid ${theme.border}`, borderRadius: "15px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "transparent" }}>
                    <thead style={{ backgroundColor: theme.tableHeaderBg }}>
                      <tr>
                        <th style={{ padding: "15px 20px", color: theme.text, textAlign: "left", borderBottom: `2px solid ${theme.border}` }}>EMPLOYEE</th>
                        <th style={{ padding: "15px 20px", color: theme.text, textAlign: "center", borderBottom: `2px solid ${theme.border}` }}>DESIGNATION</th>
                        <th style={{ padding: "15px 20px", color: theme.text, textAlign: "center", borderBottom: `2px solid ${theme.border}` }}>EMAIL</th>
                        <th style={{ padding: "15px 20px", textAlign: "center", borderBottom: `2px solid ${theme.border}` }}>
                          ROLE
                        </th>
                        <th style={{ padding: "15px 20px", color: theme.text, textAlign: "right", borderBottom: `2px solid ${theme.border}` }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => (
                        <tr key={user.id}>
                          <TableCell isBold ps="25px">
                            {user.employee ? `${user.employee.first_name} ${user.employee.last_name}` : "N/A"}
                          </TableCell>
                          <TableCell align="center">
                            <span style={{
                              backgroundColor: darkMode ? "#334155" : "#eef2ff",
                              color: darkMode ? "#818cf8" : "#4f46e5",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              fontSize: "13px",
                              fontWeight: "600"
                            }}>
                              {user.employee?.designation?.name ?? "N/A"}
                            </span>
                          </TableCell>
                          <TableCell align="center" color={theme.muted}>{user.email}</TableCell>

                          <TableCell align="center">
                            <span style={{
                              backgroundColor: user.role === "admin" ? "#fee2e2" : "#e0f2fe",
                              color: user.role === "admin" ? "#dc2626" : "#0369a1",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              fontSize: "13px",
                              fontWeight: "600",
                              textTransform: "capitalize"
                            }}>
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell align="right">
                            <button
                              className="btn btn-sm"
                              onClick={() => setUserToDelete(user.id)}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                                background: darkMode ? "#451a1a" : "#fff5f5",
                                color: "#ef4444",
                                border: "none"
                              }}
                            >
                              <i className="bi bi-trash3"></i>
                            </button>
                          </TableCell>
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
                        <button className="page-link border-0 shadow-none"
                          style={{ background: "transparent", color: theme.text }}
                          onClick={() => setCurrentPage(v => v - 1)}>Prev</button>
                      </li>
                      {[...Array(Math.ceil(users.length / itemsPerPage))].map((_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 && 'active'}`}>
                          <button className="page-link border-0 mx-1 rounded shadow-sm"
                            style={{
                              background: currentPage === i + 1 ? "#4f46e5" : theme.cardBg,
                              color: currentPage === i + 1 ? "#fff" : theme.text,
                              border: `1px solid ${theme.border}`
                            }}
                            onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === Math.ceil(users.length / itemsPerPage) && 'disabled'}`}>
                        <button className="page-link border-0 shadow-none"
                          style={{ background: "transparent", color: theme.text }}
                          onClick={() => setCurrentPage(v => v + 1)}>Next</button>
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

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(5px)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow" style={{ borderRadius: "20px", background: theme.cardBg, color: theme.text }}>
              <div className="modal-body text-center p-5">
                <div className="mb-3">
                  <i className="bi bi-exclamation-octagon text-danger" style={{ fontSize: "4rem" }}></i>
                </div>
                <h4 className="fw-bold">Are you sure?</h4>
                <p style={{ color: theme.muted }}>You won't be able to revert this employee's data!</p>
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