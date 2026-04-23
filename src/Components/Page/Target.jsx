import { useEffect, useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TargetList = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
  const [targets, setTargets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;
  const [role, setRole] = useState(localStorage.getItem('userRole'));
  const [userId, setUserId] = useState(localStorage.getItem('employeeId'));

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    target_value: '',
    month: 'January'
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const theme = {
    bg: darkMode ? '#0f172a' : '#f1f5f9',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f8fafc' : '#1e293b',
    border: darkMode ? '#334155' : '#e2e8f0',
    tableHeader: darkMode ? '#0f172a' : '#f8fafc',
    muted: darkMode ? '#94a3b8' : '#64748b',
    inputBg: darkMode ? '#1e293b' : '#fff'
  };

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = targets.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(targets.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchTargets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/get-targets`);
      const result = await response.json();
      const allData = Array.isArray(result.data) ? result.data : [];

      // 🔥 পিন-পয়েন্ট ফিল্টারিং লজিক
      const currentRole = localStorage.getItem('userRole');
      const currentEmpId = localStorage.getItem('employee_id');

      if (currentRole === 'admin') {
        setTargets(allData); // অ্যাডমিন হলে সব ডেটা
      } else {
        // ইউজার হলে শুধু নিজের ডেটা (String এ কনভার্ট করে চেক করা হয়েছে যেন টাইপ এরর না হয়)
        const myData = allData.filter(item => String(item.employee_id) === String(currentEmpId));
        setTargets(myData);
      }
    } catch (error) { 
      console.error(error); 
      toast.error("Failed to load targets");
    } finally { 
      setLoading(false); 
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/get-employee`);
      const result = await response.json();
      setEmployees(result.data || []);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    fetchTargets();
    fetchEmployees();
    // রোল এবং আইডি আপডেট হলে যেন পুনরায় চেক করে
    setRole(localStorage.getItem('userRole'));
    setUserId(localStorage.getItem('employeeId'));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setFormData({
      employee_id: item.employee_id,
      target_value: item.target_value,
      month: item.month
    });
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setSubmitLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/del-targets/${deleteTargetId}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        toast.success("Target deleted successfully!");
        setShowDeleteModal(false);
        fetchTargets();
      }
    } catch (err) { toast.error("Error"); } finally { setSubmitLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    const apiURL = isEditing ? `${BASE_URL}/api/edit-targets/${editId}` : `${BASE_URL}/api/targets`;
    try {
      const response = await fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        toast.success(isEditing ? "Updated!" : "Saved!");
        closeModal();
        fetchTargets();
      }
    } catch (err) { toast.error("Error"); } finally { setSubmitLoading(false); }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditId(null);
    setFormData({ employee_id: '', target_value: '', month: 'January' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', background: theme.bg, transition: '0.3s' }}>
      <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        
        <main style={{ flexGrow: 1, padding: "30px", width: '100%', position: 'relative' }}>
          <div style={{ 
            background: theme.cardBg, borderRadius: "24px", padding: "30px", 
            border: `1px solid ${theme.border}`, boxShadow: darkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 25px rgba(0,0,0,0.05)"
          }}>
            
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 style={{ color: theme.text, fontWeight: '700', margin: 0 }}>Sales Targets</h4>
                <p style={{ color: theme.muted, fontSize: '14px', margin: 0 }}>
                  {role === 'admin' ? `Monitor performance (${targets.length} total)` : 'My Personal Target Status'}
                </p>
              </div>
             {role === 'admin' && (
              <button 
                className="btn btn-primary shadow-sm" 
                style={{ borderRadius: '12px', padding: '10px 24px', fontWeight: '600', backgroundColor: '#10b981', border: 'none' }}
                onClick={() => { setIsEditing(false); setShowModal(true); }}
              >
                <i className="bi bi-plus-lg me-2"></i>Set Target
              </button>
             )}
            </div>

            {loading ? (
              <div className="text-center p-5"><div className="spinner-border text-success" role="status"></div></div>
            ) : (
              <>
                <div className="table-responsive" style={{ borderRadius: '18px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
                  <table className="table table-hover align-middle mb-0" style={{ color: theme.text, background: 'transparent' }}>
                    <thead style={{ background: theme.tableHeader }}>
                      <tr style={{ fontSize: '13px', color: theme.muted }}>
                        <th className="px-4 py-3 border-0">EMPLOYEE</th>
                        <th className="py-3 border-0 text-center">MONTH</th>
                        <th className="py-3 border-0 text-center">TARGET</th>
                        <th className="py-3 border-0 text-center">ACHIEVED</th>
                        <th className="py-3 border-0" style={{ width: '200px' }}>PROGRESS</th>
                        <th className="text-end px-4 py-3 border-0">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords.map((item) => {
                        const progress = Math.min((item.achieved_value / item.target_value) * 100, 100) || 0;
                        return (
                          <tr key={item.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center">
                                 <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                                      style={{ width: '38px', height: '38px', background: '#10b98120', color: '#10b981', fontWeight: '700' }}>
                                   {item.employee?.first_name?.[0]}
                                 </div>
                                 <div>
                                   <div style={{ fontWeight: '600' }}>{item.employee?.first_name} {item.employee?.last_name}</div>
                                   <small style={{ color: theme.muted }}>ID: #{item.employee_id}</small>
                                 </div>
                              </div>
                            </td>
                            <td className="text-center">{item.month}</td>
                            <td className="text-center fw-bold">৳{Number(item.target_value).toLocaleString()}</td>
                            <td className="text-center text-success">৳{Number(item.achieved_value).toLocaleString()}</td>
                            <td>
                              <div className="progress" style={{ height: '8px', background: theme.border }}>
                                <div className="progress-bar bg-success" style={{ width: `${progress}%` }}></div>
                              </div>
                              <small>{progress.toFixed(0)}%</small>
                            </td>
                            <td className="text-end px-4">
                               {role === 'admin' ? (
                                   <>
                                     <i className="bi bi-pencil-square text-success me-3" style={{cursor:'pointer'}} onClick={() => handleEdit(item)}></i>
                                     <i className="bi bi-trash text-danger" style={{cursor:'pointer'}} onClick={() => confirmDelete(item.id)}></i>
                                   </>
                               ) : (
                                   <span className="badge bg-light text-dark border">View Only</span>
                               )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-end mt-4">
                    <nav>
                      <ul className="pagination mb-0" style={{ gap: '5px' }}>
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link shadow-sm" 
                            style={{ borderRadius: '8px', border: `1px solid ${theme.border}`, background: theme.cardBg, color: theme.text }}
                            onClick={() => paginate(currentPage - 1)}
                          >
                            <i className="bi bi-chevron-left"></i>
                          </button>
                        </li>
                        
                        {[...Array(totalPages)].map((_, index) => (
                          <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button 
                              className="page-link shadow-sm" 
                              style={{ 
                                borderRadius: '8px', 
                                border: `1px solid ${theme.border}`,
                                background: currentPage === index + 1 ? '#10b981' : theme.cardBg,
                                color: currentPage === index + 1 ? '#fff' : theme.text,
                                fontWeight: '600'
                              }}
                              onClick={() => paginate(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link shadow-sm" 
                            style={{ borderRadius: '8px', border: `1px solid ${theme.border}`, background: theme.cardBg, color: theme.text }}
                            onClick={() => paginate(currentPage + 1)}
                          >
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modals remain the same but logically secured for admin only via fetch check */}
          {showModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
              <form onSubmit={handleSubmit} style={{ background: theme.cardBg, width: '450px', padding: '30px', borderRadius: '24px', border: `1px solid ${theme.border}`, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 style={{ color: theme.text, margin: 0 }}>{isEditing ? 'Update Target' : 'Add New Target'}</h5>
                  <i className="bi bi-x-lg" style={{ color: theme.text, cursor: 'pointer' }} onClick={closeModal}></i>
                </div>
                <div className="mb-3">
                  <label style={{ color: theme.muted, fontSize: '13px', display: 'block', marginBottom: '8px' }}>Select Employee</label>
                  <select name="employee_id" value={formData.employee_id} onChange={handleChange} className="form-select" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '10px' }} required>
                    <option value="">Choose Employee...</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label style={{ color: theme.muted, fontSize: '13px', display: 'block', marginBottom: '8px' }}>Target Amount (৳)</label>
                  <input name="target_value" type="number" value={formData.target_value} onChange={handleChange} className="form-control" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '10px' }} required />
                </div>
                <div className="mb-4">
                  <label style={{ color: theme.muted, fontSize: '13px', display: 'block', marginBottom: '8px' }}>Target Month</label>
                  <select name="month" value={formData.month} onChange={handleChange} className="form-select" style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={submitLoading} className="btn btn-success w-100 py-2" style={{ borderRadius: '10px', fontWeight: '600' }}>
                  {submitLoading ? 'Processing...' : (isEditing ? 'Update Target' : 'Save Target')}
                </button>
              </form>
            </div>
          )}

          {showDeleteModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, backdropFilter: 'blur(5px)' }}>
              <div style={{ background: theme.cardBg, width: '400px', padding: '30px', borderRadius: '24px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                <div className="mb-4" style={{ width: '60px', height: '60px', background: '#ef444420', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '30px' }}>
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
                <h5 style={{ color: theme.text }}>Are you sure?</h5>
                <p style={{ color: theme.muted, fontSize: '14px' }}>Do you really want to delete this target?</p>
                <div className="d-flex gap-3 mt-4">
                  <button className="btn w-100" onClick={() => setShowDeleteModal(false)} style={{ background: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '10px' }}>Cancel</button>
                  <button className="btn btn-danger w-100" onClick={handleDelete} disabled={submitLoading} style={{ borderRadius: '10px' }}>
                    {submitLoading ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default TargetList;