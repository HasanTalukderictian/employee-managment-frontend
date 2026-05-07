

// import React, { useState, useEffect } from "react";
// import Header from "./Header";
// import Menu from "./Menu";
// import Footer from "./Footer";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Task = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {

//     const [tasks, setTasks] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);

//     // New Task Modal States
//     const [newTask, setNewTask] = useState({
//         title: "",
//         dueDate: "",
//         status: "Pending",
//         note: ""
//     });
//     const [showModal, setShowModal] = useState(false);

//     // Status Update Modal States
//     const [statusModal, setStatusModal] = useState({
//         show: false,
//         taskId: null,
//         newStatus: "",
//         note: ""
//     });

//     const itemsPerPage = 15;
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(tasks.length / itemsPerPage);

//     const API_BASE_URL = "https://db.akashbariholidays.org/api/tasks";
//     const API_ADD_TASK_URL = "https://db.akashbariholidays.org/api/add-task";
//     const API_UPDATE_STATUS_URL = "https://db.akashbariholidays.org/api/update-task-status"; 

//     const theme = {
//         bg: darkMode ? "#0f172a" : "#f8f9fa",
//         cardBg: darkMode ? "#1e293b" : "#ffffff",
//         text: darkMode ? "#f8fafc" : "#212529",
//         tableText: darkMode ? "#cbd5e1" : "#333",
//         border: darkMode ? "#334155" : "#dee2e6",
//         modalBg: darkMode ? "#1e293b" : "#ffffff",
//     };

//     const fetchTasks = () => {
//         const role = localStorage.getItem("userRole");
//         const id = localStorage.getItem("employee_id");
//         let url = API_BASE_URL;
//         if (role !== "admin" && id) {
//             url = `${API_BASE_URL}?employee_id=${id}`;
//         }
//         fetch(url)
//             .then(res => res.json())
//             .then(data => setTasks(data))
//             .catch(err => toast.error(err.message));
//     };

//     useEffect(() => {
//         fetchTasks();
//     }, []);

//     const getBadgeClass = (status) => {
//         switch (status) {
//             case "Completed": return "bg-success text-white";
//             case "Pending": return "bg-warning text-dark";
//             case "Overdue": return "bg-danger text-white";
//             default: return "bg-secondary text-white";
//         }
//     };

//     // স্ট্যাটাস ড্রপডাউন চেঞ্জ করলে এই ফাংশনটি কল হবে এবং মডাল ওপেন করবে
//     const handleStatusDropdownChange = (taskId, newStatus) => {
//         setStatusModal({
//             show: true,
//             taskId: taskId,
//             newStatus: newStatus,
//             note: ""
//         });
//     };

//     // মডাল থেকে ফাইনাল সাবমিট করার ফাংশন
//     const submitStatusUpdate = (e) => {
//         e.preventDefault();
        
//         fetch(`${API_UPDATE_STATUS_URL}/${statusModal.taskId}`, {
//             method: "POST",
//             headers: {
//                 "Accept": "application/json",
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ 
//                 status: statusModal.newStatus,
//                 note: statusModal.note || `Status changed to ${statusModal.newStatus}`
//             }),
//         })
//         .then(res => res.json())
//         .then(() => {
//             setTasks(prev => prev.map(t => t.id === statusModal.taskId ? { ...t, status: statusModal.newStatus } : t));
//             toast.success("Status updated successfully!");
//             setStatusModal({ show: false, taskId: null, newStatus: "", note: "" });
//             fetchTasks();
//         })
//         .catch(err => toast.error("Failed to update status"));
//     };

//     const handleAddTask = (e) => {
//         e.preventDefault();
//         const currentId = localStorage.getItem('employee_id');

//         if (!currentId) {
//             toast.error("Employee ID missing. Please login again.");
//             return;
//         }

//         const taskData = {
//             title: newTask.title,
//             due_date: newTask.dueDate,
//             status: newTask.status,
//             employee_id: currentId,
//             note: newTask.note,
//             activities: [
//                 { logged_at: new Date().toISOString(), description: "Task Created" }
//             ],
//         };

//         fetch(API_ADD_TASK_URL, {
//             method: "POST",
//             headers: {
//                 "Accept": "application/json",
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(taskData),
//         })
//             .then(res => res.json())
//             .then((savedTask) => {
//                 setTasks(prev => [...prev, savedTask]);
//                 setNewTask({ title: "", dueDate: "", status: "Pending", note: "" });
//                 setShowModal(false);
//                 toast.success("Task added!");
//                 fetchTasks();
//             })
//             .catch(err => toast.error(err.message));
//     };

//     return (
//         <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", backgroundColor: theme.bg }}>

//             <Header darkMode={darkMode} setDarkMode={setDarkMode} />

//             <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>

//                 <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

//                 <main style={{ flexGrow: 1, padding: "25px", overflowY: "auto" }}>

//                     <h2 style={{ color: theme.text, marginBottom: '25px', fontWeight: '700' }}>
//                         Task Management
//                     </h2>

//                     {/* STATS */}
//                     <div className="row g-3 mb-4">
//                         {[
//                             { label: "Total Tasks", count: tasks.length, icon: "bi-list-task", color: "info" },
//                             { label: "Completed", count: tasks.filter(t => t.status === "Completed").length, icon: "bi-check-circle", color: "success" },
//                             { label: "Pending", count: tasks.filter(t => t.status === "Pending").length, icon: "bi-hourglass-split", color: "warning" },
//                             { label: "Overdue", count: tasks.filter(t => t.status === "Overdue").length, icon: "bi-exclamation-circle", color: "danger" }
//                         ].map((stat, i) => (
//                             <div key={i} className="col-md-3 col-sm-6">
//                                 <div className="p-4 rounded shadow-sm" style={{ backgroundColor: theme.cardBg }}>
//                                     <div className="d-flex align-items-center">
//                                         <i className={`bi ${stat.icon} fs-3 text-${stat.color} me-3`}></i>
//                                         <div>
//                                             <div style={{ color: theme.text, fontSize: "20px", fontWeight: "bold" }}>{stat.count}</div>
//                                             <div style={{ color: theme.text }}>{stat.label}</div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* NEW TASK BUTTON */}
//                     {localStorage.getItem("userRole") !== "admin" && (
//                         <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
//                             + New Task
//                         </button>
//                     )}

//                     {/* TABLE */}
//                     <div className="card shadow-sm border-0" style={{ backgroundColor: theme.cardBg }}>
//                         <div className="card-body p-0">
//                             <table className="table mb-0" style={{ color: theme.text }}>
//                                 <thead>
//                                     <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
//                                         <th style={{ color: theme.text, backgroundColor: 'transparent', padding: '15px' }}>Task</th>
//                                         <th style={{ color: theme.text, backgroundColor: 'transparent', padding: '15px' }}>Due Date</th>
//                                         <th style={{ color: theme.text, backgroundColor: 'transparent', padding: '15px' }}>Status</th>
//                                         <th style={{ color: theme.text, backgroundColor: 'transparent', padding: '15px' }}>Update Status</th>
//                                         <th style={{ color: theme.text, backgroundColor: 'transparent', padding: '15px' }}>Latest Activity</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {currentTasks.map(task => (
//                                         <tr key={task.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
//                                             <td style={{ color: theme.tableText, backgroundColor: 'transparent', padding: '15px' }}>{task.title}</td>
//                                             <td style={{ color: theme.tableText, backgroundColor: 'transparent', padding: '15px' }}>{task.due_date}</td>
//                                             <td style={{ backgroundColor: 'transparent', padding: '15px' }}>
//                                                 <span className={`badge ${getBadgeClass(task.status)}`}>{task.status}</span>
//                                             </td>
//                                             <td style={{ backgroundColor: 'transparent', padding: '15px' }}>
//                                                 <select 
//                                                     className="form-select form-select-sm"
//                                                     style={{ width: '130px', backgroundColor: darkMode ? "#334155" : "#fff", color: theme.text, borderColor: theme.border }}
//                                                     value={task.status}
//                                                     onChange={(e) => handleStatusDropdownChange(task.id, e.target.value)}
//                                                 >
//                                                     <option value="Pending">Pending</option>
//                                                     <option value="Completed">Completed</option>
//                                                     <option value="Overdue">Overdue</option>
//                                                 </select>
//                                             </td>
//                                             <td style={{ color: theme.tableText, backgroundColor: 'transparent', padding: '15px' }}>
//                                                 {task.activities?.length ? task.activities[task.activities.length - 1].description : "No logs available"}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>

//                     {/* PAGINATION */}
//                     <div className="mt-3 d-flex justify-content-end">
//                         {[...Array(totalPages)].map((_, i) => (
//                             <button
//                                 key={i}
//                                 className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : (darkMode ? "btn-outline-light" : "btn-light")} mx-1`}
//                                 onClick={() => setCurrentPage(i + 1)}
//                             >
//                                 {i + 1}
//                             </button>
//                         ))}
//                     </div>

//                 </main>
//             </div>

//             {/* ADD NEW TASK MODAL */}
//             {showModal && (
//                 <div className="modal d-block" style={{ background: "rgba(0,0,0,0.8)", zIndex: 1050 }}>
//                     <div className="modal-dialog">
//                         <div className="modal-content p-3 border-0" style={{ backgroundColor: theme.modalBg, color: theme.text }}>
//                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                 <h5 className="mb-0">Add Task</h5>
//                                 <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
//                             </div>
//                             <form onSubmit={handleAddTask}>
//                                 <input
//                                     className="form-control mb-2"
//                                     style={{ backgroundColor: darkMode ? "#334155" : "#fff", color: theme.text, borderColor: theme.border }}
//                                     placeholder="Task Title"
//                                     value={newTask.title}
//                                     onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//                                     required
//                                 />
//                                 <input
//                                     type="date"
//                                     className="form-control mb-2"
//                                     style={{ backgroundColor: darkMode ? "#334155" : "#fff", color: theme.text, borderColor: theme.border }}
//                                     value={newTask.dueDate}
//                                     onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
//                                     required
//                                 />
//                                 <textarea
//                                     className="form-control mb-3"
//                                     style={{ backgroundColor: darkMode ? "#334155" : "#fff", color: theme.text, borderColor: theme.border }}
//                                     placeholder="Task Note (optional)"
//                                     rows="3"
//                                     value={newTask.note}
//                                     onChange={(e) => setNewTask({ ...newTask, note: e.target.value })}
//                                 />
//                                 <button className="btn btn-primary w-100 shadow-sm">Create Task</button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* STATUS UPDATE MODAL (With Note) */}
//             {statusModal.show && (
//                 <div className="modal d-block" style={{ background: "rgba(0,0,0,0.8)", zIndex: 1060 }}>
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content p-3 border-0" style={{ backgroundColor: theme.modalBg, color: theme.text }}>
//                             <div className="d-flex justify-content-between align-items-center mb-3">
//                                 <h5 className="mb-0">Update Status to: {statusModal.newStatus}</h5>
//                                 <button type="button" className="btn-close btn-close-white" onClick={() => setStatusModal({ ...statusModal, show: false })}></button>
//                             </div>
//                             <form onSubmit={submitStatusUpdate}>
//                                 <div className="mb-3">
//                                     <label className="form-label">Add Note / Comment</label>
//                                     <textarea
//                                         className="form-control"
//                                         style={{ backgroundColor: darkMode ? "#334155" : "#fff", color: theme.text, borderColor: theme.border }}
//                                         placeholder="Explain what has been done..."
//                                         rows="4"
//                                         value={statusModal.note}
//                                         onChange={(e) => setStatusModal({ ...statusModal, note: e.target.value })}
//                                         required
//                                     ></textarea>
//                                 </div>
//                                 <div className="d-flex gap-2">
//                                     <button type="button" className="btn btn-secondary w-100" onClick={() => setStatusModal({ ...statusModal, show: false })}>Cancel</button>
//                                     <button type="submit" className="btn btn-primary w-100">Update Now</button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <Footer darkMode={darkMode} />
//             <ToastContainer theme={darkMode ? "dark" : "light"} />
//         </div>
//     );
// };

// export default Task;


import React, { useState, useEffect } from "react";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Task = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {

    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    // New Task Modal States
    const [newTask, setNewTask] = useState({
        title: "",
        dueDate: "",
        status: "Pending",
        note: ""
    });
    const [showModal, setShowModal] = useState(false);

    // Status Update Modal States
    const [statusModal, setStatusModal] = useState({
        show: false,
        taskId: null,
        newStatus: "",
        note: ""
    });

    const itemsPerPage = 15;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(tasks.length / itemsPerPage);

    const API_BASE_URL = "https://db.akashbariholidays.org/api/tasks";
    const API_ADD_TASK_URL = "https://db.akashbariholidays.org/api/add-task";
    const API_UPDATE_STATUS_URL = "https://db.akashbariholidays.org/api/update-task-status"; 

    const theme = {
        bg: darkMode ? "#0f172a" : "#f8f9fa",
        cardBg: darkMode ? "#1e293b" : "#ffffff",
        text: darkMode ? "#f8fafc" : "#212529",
        tableText: darkMode ? "#cbd5e1" : "#333",
        border: darkMode ? "#334155" : "#dee2e6",
        modalBg: darkMode ? "#1e293b" : "#ffffff",
    };

    const fetchTasks = () => {
        const role = localStorage.getItem("userRole");
        const id = localStorage.getItem("employee_id");
        let url = API_BASE_URL;
        if (role !== "admin" && id) {
            url = `${API_BASE_URL}?employee_id=${id}`;
        }
        fetch(url)
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => toast.error(err.message));
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const getBadgeClass = (status) => {
        switch (status) {
            case "Completed": return "bg-success text-white";
            case "Pending": return "bg-warning text-dark";
            case "Overdue": return "bg-danger text-white";
            default: return "bg-secondary text-white";
        }
    };

    // ড্রপডাউন থেকে স্ট্যাটাস চেঞ্জ করলে নোট মডাল আসবে
    const handleStatusDropdownChange = (taskId, newStatus) => {
        setStatusModal({
            show: true,
            taskId: taskId,
            newStatus: newStatus,
            note: ""
        });
    };

    // স্ট্যাটাস আপডেট সাবমিট
    const submitStatusUpdate = (e) => {
        e.preventDefault();
        fetch(`${API_UPDATE_STATUS_URL}/${statusModal.taskId}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                status: statusModal.newStatus,
                note: statusModal.note || `Status changed to ${statusModal.newStatus}`
            }),
        })
        .then(res => res.json())
        .then(() => {
            setTasks(prev => prev.map(t => t.id === statusModal.taskId ? { ...t, status: statusModal.newStatus } : t));
            toast.success("Status updated successfully!");
            setStatusModal({ show: false, taskId: null, newStatus: "", note: "" });
            fetchTasks();
        })
        .catch(err => toast.error("Failed to update status"));
    };

    // নতুন টাস্ক সাবমিট
    const handleAddTask = (e) => {
        e.preventDefault();
        const currentId = localStorage.getItem('employee_id');

        if (!currentId) {
            toast.error("Employee ID missing. Please login again.");
            return;
        }

        const taskData = {
            title: newTask.title,
            due_date: newTask.dueDate,
            status: newTask.status,
            employee_id: currentId,
            note: newTask.note,
            activities: [
                { logged_at: new Date().toISOString(), description: "Task Created" }
            ],
        };

        fetch(API_ADD_TASK_URL, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        })
            .then(res => res.json())
            .then((savedTask) => {
                setTasks(prev => [...prev, savedTask]);
                setNewTask({ title: "", dueDate: "", status: "Pending", note: "" });
                setShowModal(false); // ক্লোজ মডাল
                toast.success("Task added!");
                fetchTasks();
            })
            .catch(err => toast.error(err.message));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", backgroundColor: theme.bg }}>

            <Header darkMode={darkMode} setDarkMode={setDarkMode} />

            <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>

                <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

                <main style={{ flexGrow: 1, padding: "25px", overflowY: "auto" }}>

                    <h2 style={{ color: theme.text, marginBottom: '25px', fontWeight: '700' }}>
                        Task Management
                    </h2>

                    {/* STATS */}
                    <div className="row g-3 mb-4">
                        {[
                            { label: "Total Tasks", count: tasks.length, icon: "bi-list-task", color: "info" },
                            { label: "Completed", count: tasks.filter(t => t.status === "Completed").length, icon: "bi-check-circle", color: "success" },
                            { label: "Pending", count: tasks.filter(t => t.status === "Pending").length, icon: "bi-hourglass-split", color: "warning" },
                            { label: "Overdue", count: tasks.filter(t => t.status === "Overdue").length, icon: "bi-exclamation-circle", color: "danger" }
                        ].map((stat, i) => (
                            <div key={i} className="col-md-3 col-sm-6">
                                <div className="p-4 rounded shadow-sm" style={{ backgroundColor: theme.cardBg }}>
                                    <div className="d-flex align-items-center">
                                        <i className={`bi ${stat.icon} fs-3 text-${stat.color} me-3`}></i>
                                        <div>
                                            <div style={{ color: theme.text, fontSize: "20px", fontWeight: "bold" }}>{stat.count}</div>
                                            <div style={{ color: theme.text }}>{stat.label}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CREATE TASK BUTTON */}
                    {localStorage.getItem("userRole") !== "admin" && (
                        <button className="btn btn-primary mb-3 shadow-sm" onClick={() => setShowModal(true)}>
                            <i className="bi bi-plus-lg me-2"></i>New Task
                        </button>
                    )}

                    {/* TABLE */}
                    <div className="card shadow-sm border-0" style={{ backgroundColor: theme.cardBg }}>
                        <div className="card-body p-0">
                            <table className="table mb-0" style={{ color: theme.text }}>
                                <thead>
                                    <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                                        <th style={{ color: theme.text, backgroundColor: 'transparent', padding: '15px' }}>Task</th>
                                        <th style={{ color: theme.text, backgroundColor: 'transparent', padding: '15px' }}>Due Date</th>
                                        <th style={{ color: theme.text, backgroundColor: 'transparent', padding: '15px' }}>Status</th>
                                        <th style={{ color: theme.text, backgroundColor: 'transparent', padding: '15px' }}>Update Status</th>
                                        <th style={{ color: theme.text, backgroundColor: 'transparent', padding: '15px' }}>Latest Activity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTasks.map(task => (
                                        <tr key={task.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                                            <td style={{ color: theme.tableText, backgroundColor: 'transparent', padding: '15px' }}>{task.title}</td>
                                            <td style={{ color: theme.tableText, backgroundColor: 'transparent', padding: '15px' }}>{task.due_date}</td>
                                            <td style={{ backgroundColor: 'transparent', padding: '15px' }}>
                                                <span className={`badge ${getBadgeClass(task.status)}`}>{task.status}</span>
                                            </td>
                                            <td style={{ backgroundColor: 'transparent', padding: '15px' }}>
                                                <select 
                                                    className="form-select form-select-sm"
                                                    style={{ width: '130px', backgroundColor: darkMode ? "#334155" : "#fff", color: theme.text, borderColor: theme.border }}
                                                    value={task.status}
                                                    onChange={(e) => handleStatusDropdownChange(task.id, e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Overdue">Overdue</option>
                                                </select>
                                            </td>
                                            <td style={{ color: theme.tableText, backgroundColor: 'transparent', padding: '15px' }}>
                                                {task.activities?.length ? task.activities[task.activities.length - 1].description : "No logs"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINATION */}
                    <div className="mt-3 d-flex justify-content-end">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : (darkMode ? "btn-outline-light" : "btn-light")} mx-1`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                </main>
            </div>

            {/* NEW TASK MODAL - FIX: Close button added and handler improved */}
            {showModal && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.8)", zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content p-3 border-0" style={{ backgroundColor: theme.modalBg, color: theme.text }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Create New Task</h5>
                                <button type="button" className={`btn-close ${darkMode ? 'btn-close-white' : ''}`} onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleAddTask}>
                                <div className="mb-2">
                                    <input
                                        className="form-control"
                                        style={{ backgroundColor: darkMode ? "#334155" : "#fff", color: theme.text, borderColor: theme.border }}
                                        placeholder="Task Title"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <input
                                        type="date"
                                        className="form-control"
                                        style={{ backgroundColor: darkMode ? "#334155" : "#fff", color: theme.text, borderColor: theme.border }}
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        style={{ backgroundColor: darkMode ? "#334155" : "#fff", color: theme.text, borderColor: theme.border }}
                                        placeholder="Add a detailed note..."
                                        rows="3"
                                        value={newTask.note}
                                        onChange={(e) => setNewTask({ ...newTask, note: e.target.value })}
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-secondary w-100" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary w-100">Create Task</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* STATUS UPDATE MODAL */}
            {statusModal.show && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.8)", zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content p-3 border-0" style={{ backgroundColor: theme.modalBg, color: theme.text }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Update Status: {statusModal.newStatus}</h5>
                                <button type="button" className={`btn-close ${darkMode ? 'btn-close-white' : ''}`} onClick={() => setStatusModal({ ...statusModal, show: false })}></button>
                            </div>
                            <form onSubmit={submitStatusUpdate}>
                                <div className="mb-3">
                                    <label className="form-label">Task Status Log/Note</label>
                                    <textarea
                                        className="form-control"
                                        style={{ backgroundColor: darkMode ? "#334155" : "#fff", color: theme.text, borderColor: theme.border }}
                                        placeholder="Describe the update..."
                                        rows="3"
                                        value={statusModal.note}
                                        onChange={(e) => setStatusModal({ ...statusModal, note: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-secondary w-100" onClick={() => setStatusModal({ ...statusModal, show: false })}>Cancel</button>
                                    <button type="submit" className="btn btn-primary w-100">Update Now</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <Footer darkMode={darkMode} />
            <ToastContainer theme={darkMode ? "dark" : "light"} />
        </div>
    );
};

export default Task;