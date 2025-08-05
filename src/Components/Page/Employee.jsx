import { useEffect, useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate(); // for view and edit navigation

  const BASE_URL = import.meta.env.VITE_BASE_URL;

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
      const employeeData = result.data;
      setEmployees(Array.isArray(employeeData) ? employeeData : []);
      setCurrentPage(1); // Reset to first page on new fetch
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

    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/del-employee/${id}`, {
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

  const handleView = (id) => {
    navigate(`/employee/view/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/employee/edit/${id}`);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Pagination handlers
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

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '1890px',
        height: '1024px',
        margin: '0 auto', // centers horizontally
        border: '1px solid #ccc', // optional: for visual debug
        boxSizing: 'border-box',
      }}
    >
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main
          style={{
            flexGrow: 1,
            padding: "40px",
            background: "#f0eee7",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              padding: "30px",
              minHeight: "90vh",
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
              <Link to="/admin-add-employee" className="ms-2">
                <button className="btn btn-success">Add Employee</button>
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
                        <th className="text-center h6">Name</th>
                        <th className="text-center h6">Phone</th>
                        <th className="text-center h6">Status</th>
                        <th className="text-center h6">Department</th>
                        <th className="text-center h6">Designation</th>
                        <th className="text-center h6">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEmployees.length > 0 ? (
                        currentEmployees.map((employee) => (
                          <tr key={employee.id}>
                            <td className="text-center">{employee.first_name}</td>
                            <td className="text-center">{employee.phone}</td>
                            <td className="text-center">{employee.status}</td>
                            <td className="text-center">{employee.department.name}</td>
                            <td className="text-center">{employee.designation.name}</td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center align-items-center">
                                <button
                                  className="btn btn-info btn-sm me-2"
                                  onClick={() => handleView(employee.id)}
                                >
                                  <i className="bi bi-eye me-1"></i> View
                                </button>
                                <button
                                  className="btn btn-success btn-sm me-2"
                                  onClick={() => handleEdit(employee.id)}
                                >
                                  <i className="bi bi-pencil-square me-1"></i> Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDelete(employee.id)}
                                >
                                  <i className="bi bi-trash me-1"></i> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No employees found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>



                {/* Pagination */}
                <div className="d-flex justify-content-center mt-4">
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

export default Employee;
