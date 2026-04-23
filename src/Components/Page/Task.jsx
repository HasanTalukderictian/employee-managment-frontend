import React, { useState, useEffect } from "react";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Task = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: "",
        dueDate: "",
        status: "Pending",
    });
    const [showModal, setShowModal] = useState(false);

    // API URLs
    const API_BASE_URL = "http://localhost:8000/api/tasks"; 
    const API_ADD_TASK_URL = "http://localhost:8000/api/add-task";

    // Theme Config
    const theme = {
        bg: darkMode ? "#0f172a" : "#f8f9fa",
        cardBg: darkMode ? "#1e293b" : "#ffffff",
        text: darkMode ? "#f8fafc" : "#212529",
        tableRow: darkMode ? "#1e293b" : "#ffffff",
        tableText: darkMode ? "#cbd5e1" : "#333",
        border: darkMode ? "#334155" : "#dee2e6",
        modalBg: darkMode ? "#1e293b" : "#ffffff",
    };

    // Fetch Tasks
    useEffect(() => {
        const role = localStorage.getItem("userRole");
        const id = localStorage.getItem("employee_id");
        let url = API_BASE_URL;

        if (role !== "admin" && id) {
            url = `${API_BASE_URL}?employee_id=${id}`;
        }

        fetch(url)
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Error ${res.status}: ${text}`);
                }
                return res.json();
            })
            .then((data) => {
                setTasks(data);
            })
            .catch((err) => {
                toast.error(`Fetch error: ${err.message}`);
            });
    }, []);

    const getBadgeClass = (status) => {
        switch (status) {
            case "Completed": return "bg-success text-white";
            case "Pending": return "bg-warning text-dark";
            case "Overdue": return "bg-danger text-white";
            default: return "bg-secondary text-white";
        }
    };

    const handleStatusChange = (id, newStatus) => {
        const currentId = localStorage.getItem('employee_id'); // সরাসরি আইডি নেওয়া হয়েছে
        
        fetch(`${API_BASE_URL}/${id}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: newStatus,
                employee_id: currentId, 
            }),
        })
            .then((res) => res.json())
            .then((updatedTask) => {
                setTasks((prev) =>
                    prev.map((task) =>
                        task.id === id ? { ...task, status: newStatus } : task
                    )
                );
                toast.success("Status updated!");
            })
            .catch((err) => console.error("Error updating status:", err));
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        const currentId = localStorage.getItem('employee_id'); // সরাসরি আইডি নেওয়া হয়েছে

        if (!currentId) {
            toast.error("Employee ID missing. Please login again.");
            return;
        }

        const taskData = {
            title: newTask.title,
            due_date: newTask.dueDate,
            status: newTask.status,
            employee_id: currentId,
            activities: [{ logged_at: new Date().toISOString(), description: "Task Created" }],
        };

        fetch(API_ADD_TASK_URL, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw data;
                return data;
            })
            .then((savedTask) => {
                setTasks((prev) => [...prev, savedTask]);
                setNewTask({ title: "", dueDate: "", status: "Pending" });
                setShowModal(false);
                toast.success("Task added!");
            })
            .catch((err) => {
                console.error("Error adding task:", err);
                toast.error(err.message || "Something went wrong");
            });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%", backgroundColor: theme.bg, transition: '0.3s' }}>
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />
            <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
                
                <main style={{ flexGrow: 1, padding: "25px", overflowY: "auto" }}>
                    <h2 style={{ color: theme.text, marginBottom: '25px', fontWeight: '700' }}>Task Management</h2>

                    <div className="row g-3 mb-4">
                        {[
                            { label: "Total Tasks", count: tasks.length, icon: "bi-list-task", color: "info", gradient: "linear-gradient(135deg, #e0f7fa, #ffffff)" },
                            { label: "Completed", count: tasks.filter(t => t.status === "Completed").length, icon: "bi-check-circle", color: "success", gradient: "linear-gradient(135deg, #c8e6c9, #ffffff)" },
                            { label: "Pending", count: tasks.filter(t => t.status === "Pending").length, icon: "bi-hourglass-split", color: "warning", gradient: "linear-gradient(135deg, #fff9c4, #ffffff)" },
                            { label: "Overdue", count: tasks.filter(t => t.status === "Overdue").length, icon: "bi-exclamation-circle", color: "danger", gradient: "linear-gradient(135deg, #ffcdd2, #ffffff)" }
                        ].map((stat, i) => (
                            <div key={i} className="col-md-3 col-sm-6">
                                <div className="p-4 rounded shadow-sm border-0" 
                                     style={{ background: darkMode ? theme.cardBg : stat.gradient, borderLeft: darkMode ? `4px solid var(--bs-${stat.color})` : 'none' }}>
                                    <div className="d-flex align-items-center mb-2">
                                        <div className={`bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center me-3`}
                                             style={{ width: '45px', height: '45px' }}>
                                            <i className={`bi ${stat.icon} fs-4 text-${stat.color}`}></i>
                                        </div>
                                        <div className="fs-4 fw-bold" style={{ color: theme.text }}>{stat.count}</div>
                                    </div>
                                    <div className="fw-semibold" style={{ color: theme.text }}>{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {localStorage.getItem("userRole") !== "admin" && (
                        <button className="btn btn-primary shadow-sm mb-4 px-4 py-2" onClick={() => setShowModal(true)}>
                            <i className="bi bi-plus-lg me-2"></i> New Task
                        </button>
                    )}

                    <div className="card shadow-sm border-0" style={{ backgroundColor: theme.cardBg, borderRadius: '15px', overflow: 'hidden' }}>
                        <div className="card-header fw-bold py-3" style={{ background: darkMode ? "#2d3748" : "#fff", color: theme.text, borderBottom: `1px solid ${theme.border}` }}>
                            <i className="bi bi-table me-2"></i> Tasks Overview
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0" style={{ color: theme.tableText }}>
                                    <thead style={{ backgroundColor: darkMode ? "#111827" : "#343a40" }}>
                                        <tr style={{ color: "#fff" }}>
                                            {localStorage.getItem("userRole") === "admin" && <th className="px-4 py-3 border-0">Employee</th>}
                                            <th className="px-4 py-3 border-0">Task Name</th>
                                            <th className="px-4 py-3 border-0">Due Date</th>
                                            <th className="px-4 py-3 border-0">Status</th>
                                            <th className="px-4 py-3 border-0">Recent Activity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task) => (
                                            <tr key={task.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                                                {localStorage.getItem("userRole") === "admin" && (
                                                    <td className="px-4 py-3" style={{ color: theme.tableText }}>
                                                        {task.employee ? `${task.employee.first_name} ${task.employee.last_name}` : "N/A"}
                                                    </td>
                                                )}
                                                <td className="px-4 py-3 fw-medium" style={{ color: theme.tableText }}>{task.title}</td>
                                                <td className="px-4 py-3" style={{ color: theme.tableText }}>{task.due_date}</td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        className={`form-select form-select-sm border-0 shadow-sm ${getBadgeClass(task.status)}`}
                                                        style={{ width: '130px', borderRadius: '8px', cursor: 'pointer' }}
                                                        value={task.status}
                                                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Overdue">Overdue</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {!task.activities?.length ? <small className="opacity-50">No logs</small> : (
                                                        task.activities.slice(-1).map((act, idx) => (
                                                            <div key={idx} className="small">
                                                                <span className="text-primary fw-bold">●</span> {act.description}
                                                                <br/><span className="text-muted" style={{ fontSize: '11px' }}>{new Date(act.logged_at).toLocaleDateString()}</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {showModal && (
                        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: 'blur(4px)' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content border-0" style={{ backgroundColor: theme.modalBg, color: theme.text, borderRadius: '15px' }}>
                                    <div className="modal-header border-0 pb-0">
                                        <h5 className="modal-title fw-bold">Add New Task</h5>
                                        <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <form onSubmit={handleAddTask}>
                                        <div className="modal-body p-4">
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold">TASK TITLE</label>
                                                <input type="text" className="form-control" style={{ backgroundColor: darkMode ? "#0f172a" : "#fff", color: theme.text, border: `1px solid ${theme.border}` }}
                                                    value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold">DUE DATE</label>
                                                <input type="date" className="form-control" style={{ backgroundColor: darkMode ? "#0f172a" : "#fff", color: theme.text, border: `1px solid ${theme.border}` }}
                                                    value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="modal-footer border-0">
                                            <button type="button" className="btn btn-link text-decoration-none" style={{ color: theme.text }} onClick={() => setShowModal(false)}>Cancel</button>
                                            <button type="submit" className="btn btn-primary px-4">Create Task</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            <ToastContainer theme={darkMode ? "dark" : "light"} />
            <Footer darkMode={darkMode} />
        </div>
    );
};

export default Task;