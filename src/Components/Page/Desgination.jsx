import { useEffect, useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Toast import

const Desgination = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${BASE_URL}/api/get-desi`;
        if (searchQuery.trim()) {
          url += `?search=${encodeURIComponent(searchQuery)}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
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
    fetchEmployees();
  }, [searchQuery]);

  // ডিলিট কনফার্ম করার জন্য মোডাল ওপেন করা
  const openDeleteModal = (id) => {
    if (role !== 'admin') {
      toast.error('You are not authorized to delete.');
      return;
    }
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem('authToken');
    const loadingToast = toast.loading("Deleting...");

    try {
      const response = await fetch(`${BASE_URL}/api/del-desi/${deleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Delete failed');
      
      setEmployees((prev) => prev.filter((emp) => emp.id !== deleteId));
      toast.success("Designation deleted successfully!", { id: loadingToast });
    } catch (error) {
      toast.error('Delete failed: ' + error.message, { id: loadingToast });
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const handleSearch = () => setSearchQuery(searchTerm.trim());
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '1890px', height: '1024px', margin: '0 auto', boxSizing: 'border-box' }}>
      <Toaster position="top-right" />
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main style={{ flexGrow: 1, padding: '40px', background: '#f8f9fa', overflowY: 'auto' }}>
          
          <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', padding: '30px', position: 'relative', minHeight: '85vh' }}>
            
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex" style={{ width: '70%' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search designation..."
                  value={searchTerm}
                  style={{ borderRadius: '8px 0 0 8px', border: '1px solid #ced4da' }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="btn btn-primary" style={{ borderRadius: '0 8px 8px 0' }} onClick={handleSearch}>
                  Search
                </button>
              </div>

              <Link to="/admin-add-desgination">
                <button className="btn btn-success" style={{ padding: '10px 20px', borderRadius: '8px', fontWeight: '600' }}>
                  + Add Designation
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2">Loading designations...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover" style={{ border: '1px solid #eee' }}>
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th style={{ padding: '15px', color: '#444' }}>Designation Name</th>
                      <th className="text-center" style={{ padding: '15px', color: '#444' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmployees.length > 0 ? (
                      currentEmployees.map((employee) => (
                        <tr key={employee.id}>
                          <td style={{ padding: '15px', verticalAlign: 'middle', fontWeight: '500' }}>{employee.name}</td>
                          <td className="text-center" style={{ padding: '15px' }}>
                            {role === 'admin' && (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                style={{ borderRadius: '6px', padding: '6px 15px' }}
                                onClick={() => openDeleteModal(employee.id)}
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="2" className="text-center py-4 text-muted">No data available</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)' }}>
               <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={handlePrevPage}>Previous</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={handleNextPage}>Next</button>
                    </li>
                  </ul>
               </nav>
            </div>
          </div>
        </main>
      </div>
      <Footer />

      {/* --- CUSTOM MODAL --- */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 9999
        }}>
          <div style={{
            background: '#fff', padding: '30px', borderRadius: '15px',
            width: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{ fontSize: '50px', color: '#dc3545', marginBottom: '15px' }}>⚠️</div>
            <h3>Are you sure?</h3>
            <p style={{ color: '#666' }}>Do you really want to delete this designation? This action cannot be undone.</p>
            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '10px 25px', borderRadius: '8px' }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                style={{ padding: '10px 25px', borderRadius: '8px' }}
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Desgination;