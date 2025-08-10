import React, { useState } from 'react';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';

const Task = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Prepare Monthly Report", dueDate: "2025-08-15", status: "Pending" },
        { id: 2, title: "Update Employee Records", dueDate: "2025-08-12", status: "Completed" },
        { id: 3, title: "Team Meeting", dueDate: "2025-08-11", status: "Overdue" },
        { id: 4, title: "Review Leave Applications", dueDate: "2025-08-14", status: "Pending" },
    ]);

    const getBadgeClass = (status) => {
        switch (status) {
            case "Completed": return "bg-success";
            case "Pending": return "bg-warning text-dark";
            case "Overdue": return "bg-danger";
            default: return "bg-secondary";
        }
    };

    // Update status in state
    const handleStatusChange = (id, newStatus) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, status: newStatus } : task
        ));
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                width: '1890px',
                margin: '0 auto',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
            }}
        >
            <Header />
            <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                <Menu />
                <main style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}> 

                    <h2 className='mt-4 mb-4'>Task Management</h2>

                    {/* Summary Cards */}
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map(task => (
                                        <tr key={task.id}>
                                            <td>{task.title}</td>
                                            <td>{task.dueDate}</td>
                                            <td>
                                                <select
                                                    className={`form-select form-select-sm ${getBadgeClass(task.status)}`}
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Overdue">Overdue</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Task;
