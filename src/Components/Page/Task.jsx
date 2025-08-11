import React, { useState, useEffect } from "react";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: "",
        dueDate: "",
        status: "Pending",
    });
    const [showModal, setShowModal] = useState(false);

    const API_BASE_URL = "http://localhost:8000/api/tasks"; // GET + PUT
    const API_ADD_TASK_URL = "http://localhost:8000/api/add-task"; // POST

    // ✅ Fetch tasks from backend when page loads
    useEffect(() => {
        fetch(API_BASE_URL)
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Error ${res.status}: ${text}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log("Fetched tasks:", data);
                setTasks(data);
            })
            .catch((err) => {
                console.error("Fetch error:", err.message);
                toast.error(`Fetch error: ${err.message}`);
            });
    }, []);



    const getBadgeClass = (status) => {
        switch (status) {
            case "Completed":
                return "bg-success text-white";
            case "Pending":
                return "bg-warning text-dark";
            case "Overdue":
                return "bg-danger text-white";
            default:
                return "bg-secondary text-white";
        }
    };

    // ✅ Update task status in backend
    const handleStatusChange = (id, newStatus) => {
        fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        })
            .then((res) => res.json())
            .then((updatedTask) => {
                setTasks((prev) =>
                    prev.map((task) =>
                        task.id === id ? { ...updatedTask } : task
                    )
                );
            })
            .catch((err) => console.error("Error updating status:", err));
    };

    // ✅ Send new task to backend
    const handleAddTask = (e) => {
        e.preventDefault();

        const taskData = {
            title: newTask.title,
            due_date: newTask.dueDate,
            status: newTask.status,
            activity: [
                { timestamp: new Date().toLocaleString(), description: "Task Created" },
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
            .then((res) => res.json())
            .then((savedTask) => {
                setTasks((prev) => [...prev, savedTask]);
                setNewTask({ title: "", dueDate: "", status: "Pending" });
                setShowModal(false);
                toast.success("Task added successfully!");
            })
            .catch((err) => console.error("Error adding task:", err));
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                width: "1890px",
                margin: "0 auto",
                border: "1px solid #ccc",
                boxSizing: "border-box",
            }}
        >
            <Header />
            <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
                <Menu />
                <main style={{ flexGrow: 1, padding: "20px", overflowY: "auto" }}>
                    <h2 className="mt-4 mb-4">Task Management</h2>

                    {/* ... your summary cards code unchanged ... */}

                    <div className="row g-3 mb-4">
                        <div className="col-md-3 col-sm-6">
                            <div className="p-4 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #e0f7fa, #ffffff)' }}>
                                <div className="d-flex align-items-center mb-2">
                                    <div className="bg-white rounded-circle shadow d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '50px', height: '50px' }}>
                                        <i className="bi bi-list-task fs-4 text-info"></i>
                                    </div>
                                    <div className="fs-5 fw-bold text-dark">{tasks.length}</div>
                                </div>
                                <div className="fw-semibold text-dark">Total Tasks</div>
                                <small className="text-muted">All assigned tasks</small>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="p-4 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #c8e6c9, #ffffff)' }}>
                                <div className="d-flex align-items-center mb-2">
                                    <div className="bg-white rounded-circle shadow d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '50px', height: '50px' }}>
                                        <i className="bi bi-check-circle fs-4 text-success"></i>
                                    </div>
                                    <div className="fs-5 fw-bold text-dark">
                                        {tasks.filter(t => t.status === "Completed").length}
                                    </div>
                                </div>
                                <div className="fw-semibold text-dark">Completed</div>
                                <small className="text-muted">Finished tasks</small>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="p-4 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #fff9c4, #ffffff)' }}>
                                <div className="d-flex align-items-center mb-2">
                                    <div className="bg-white rounded-circle shadow d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '50px', height: '50px' }}>
                                        <i className="bi bi-hourglass-split fs-4 text-warning"></i>
                                    </div>
                                    <div className="fs-5 fw-bold text-dark">
                                        {tasks.filter(t => t.status === "Pending").length}
                                    </div>
                                </div>
                                <div className="fw-semibold text-dark">Pending</div>
                                <small className="text-muted">Awaiting completion</small>
                            </div>
                        </div>

                        <div className="col-md-3 col-sm-6">
                            <div className="p-4 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #ffcdd2, #ffffff)' }}>
                                <div className="d-flex align-items-center mb-2">
                                    <div className="bg-white rounded-circle shadow d-flex align-items-center justify-content-center me-3"
                                        style={{ width: '50px', height: '50px' }}>
                                        <i className="bi bi-exclamation-circle fs-4 text-danger"></i>
                                    </div>
                                    <div className="fs-5 fw-bold text-dark">
                                        {tasks.filter(t => t.status === "Overdue").length}
                                    </div>
                                </div>
                                <div className="fw-semibold text-dark">Overdue</div>
                                <small className="text-muted">Past due date</small>
                            </div>
                        </div>
                    </div>

                    {/* New Task Button */}
                    <button
                        className="btn btn-primary mb-3"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="bi bi-plus-lg"></i> New Task
                    </button>

                    {/* Modal - Pure React */}
                    {showModal && (
                        <div
                            className="modal fade show d-block"
                            tabIndex="-1"
                            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                        >
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Task</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setShowModal(false)}
                                        ></button>
                                    </div>
                                    <form onSubmit={handleAddTask}>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label fs-5 text-start h2 d-block">Task Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={newTask.title}
                                                    onChange={(e) =>
                                                        setNewTask({ ...newTask, title: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fs-5 text-start h2 d-block">Due Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={newTask.dueDate}
                                                    onChange={(e) =>
                                                        setNewTask({ ...newTask, dueDate: e.target.value })
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fs-5 text-start h2 d-block">Status</label>
                                                <select
                                                    className="form-select"
                                                    value={newTask.status}
                                                    onChange={(e) =>
                                                        setNewTask({ ...newTask, status: e.target.value })
                                                    }
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Overdue">Overdue</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Close
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Add Task
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Task Table */}
                    <div className="card shadow-sm border">
                        <div className="card-header bg-white fw-bold border-bottom">
                            <i className="bi bi-table me-2"></i> Task List
                        </div>
                        <div className="card-body p-0">
                            <table className="table table-bordered table-hover mb-0 bg-white">
                                <thead className="table-light">
                                    <tr>
                                        <th>Task</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th>Activity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task) => (
                                        <tr key={task.id}>
                                            <td>{task.title}</td>
                                            <td>{task.due_date}</td>
                                            <td>
                                                <select
                                                    className={`form-select form-select-sm ${getBadgeClass(
                                                        task.status
                                                    )}`}
                                                    value={task.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(task.id, e.target.value)
                                                    }
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Overdue">Overdue</option>
                                                </select>
                                            </td>
                                            <td>
                                                {!Array.isArray(task.activities) || task.activities.length === 0 ? (
                                                    <small className="text-muted">No activity yet</small>
                                                ) : (
                                                    task.activities
                                                        .slice(-3)
                                                        .map((act, idx) => (
                                                            <div key={idx}>
                                                                <small>
                                                                    [{act.logged_at}] {act.description}
                                                                </small>
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
                </main>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />

            <Footer />
        </div>
    );
};

export default Task;
