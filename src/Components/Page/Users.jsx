import { useEffect, useState } from "react";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/api/get-users`;
      if (searchQuery.trim()) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch users");

      const result = await response.json();
      const userData = result.data;
      setUsers(Array.isArray(userData) ? userData : []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);


  const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const response = await fetch(`${BASE_URL}/api/delete-user/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    setUsers(users.filter((user) => user.id !== id));
  } catch (err) {
    alert(err.message);
  }
};


  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "1890px",
        height: "1024px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <Header />
      <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Menu />
        <main
          style={{
            flexGrow: 1,
            padding: "40px",
            background: "#f0eee7",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              padding: "30px",
              minHeight: "90vh",
              position: "relative",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={searchTerm}
                style={{ width: "78%" }}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="btn btn-primary ms-2" onClick={handleSearch}>
                <i className="bi bi-search me-1"></i> Search
              </button>
              <Link to="/admin-add-user" className="ms-2">
                <button className="btn btn-success">Add User</button>
              </Link>
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
                        <th className="text-center h6">Email</th>
                        <th className="text-center h6">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.length > 0 ? (
                        currentUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="text-center">{user.email}</td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(user.id)}
                                title="Delete user"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center">
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>

                  </table>
                </div>

                {/* Fixed Pagination at Bottom */}
                <div
                  className="d-flex justify-content-center"
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: 0,
                    right: 0,
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
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Users;
