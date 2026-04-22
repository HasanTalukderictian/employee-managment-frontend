import React, { useState, useEffect } from 'react';
import Header from './Header';
import Menu from './Menu';

const Target = ({
    darkMode: propDarkMode,
    setDarkMode: propSetDarkMode,
    isExpanded: propIsExpanded,
    setIsExpanded: propSetIsExpanded
}) => {

    const [localDarkMode, setLocalDarkMode] = useState(false);
    const [localIsExpanded, setLocalIsExpanded] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // API Data States
    const [employees, setEmployees] = useState([]); // Employee list
    const [loading, setLoading] = useState(false);

    // Form Field States
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [targetValue, setTargetValue] = useState("");

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const darkMode = propDarkMode !== undefined ? propDarkMode : localDarkMode;
    const setDarkMode = propSetDarkMode || setLocalDarkMode;
    const isExpanded = propIsExpanded !== undefined ? propIsExpanded : localIsExpanded;
    const setIsExpanded = propSetIsExpanded || setLocalIsExpanded;

    // API থেকে Employee ডাটা ফেচ করা
    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/api/get-emplyee`);
                const result = await response.json();
                // আপনার API রেসপন্স অনুযায়ী ডাটা সেট (সাধারণত result.data তে থাকে)
                setEmployees(Array.isArray(result.data) ? result.data : []);
            } catch (err) {
                console.error("Error fetching employees:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [BASE_URL]);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const theme = {
        bg: darkMode ? '#0f172a' : '#f8f9fa',
        cardBg: darkMode ? '#1e293b' : '#ffffff',
        text: darkMode ? '#f8fafc' : '#1e293b',
        border: darkMode ? '#334155' : '#e2e8f0',
        inputBg: darkMode ? '#0f172a' : '#ffffff',
    };

    const handleSave = () => {
        console.log({
            employeeId: selectedEmployee,
            month: selectedMonth,
            target: targetValue
        });
        // এখানে আপনার সেভ API কল করতে পারেন
        setShowModal(false);
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', width: '100%',
            minHeight: '100vh', background: theme.bg, color: theme.text,
            transition: 'all 0.3s ease', position: 'relative'
        }}>
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />

            <div style={{ display: 'flex', flexGrow: 1 }}>
                <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

                <main style={{ flexGrow: 1, padding: '25px', transition: 'all 0.3s ease' }}>
                    <div style={{
                        background: theme.cardBg, borderRadius: '20px', padding: '30px',
                        border: `1px solid ${theme.border}`, minHeight: '80vh'
                    }}>
                        <h2 className="mb-4">Target Management</h2>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search here..."
                                style={{ maxWidth: '400px', background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                className="btn btn-success px-4"
                                style={{ borderRadius: '10px', fontWeight: '600' }}
                                onClick={() => setShowModal(true)}
                            >
                                + Add Target
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* --- সুন্দর মোডাল --- */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 9999,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: theme.cardBg, width: '95%', maxWidth: '450px',
                        borderRadius: '20px', padding: '30px',
                        border: `1px solid ${theme.border}`,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 style={{ color: '#10b981', margin: 0, fontWeight: '700' }}>Set Employee Target</h4>
                            <i
                                className="bi bi-x-lg"
                                style={{ cursor: 'pointer', fontSize: '20px' }}
                                onClick={() => setShowModal(false)}
                            ></i>
                        </div>

                        {/* Employee Dropdown */}
                        <div className="mb-3">
                            <label className="mb-2">Select Employee</label>
                            <select
                                className="form-select"
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                            >
                                <option value="">Choose Employee...</option>

                                {employees.length > 0 ? (
                                    employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.first_name || "No"} {emp.last_name || "Name"}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No Employees Found</option>
                                )}
                            </select>
                        </div>

                        {/* Month Dropdown */}
                        <div className="mb-3">
                            <label className="mb-2">Select Month</label>
                            <select
                                className="form-select"
                                style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                <option value="">Choose Month...</option>
                                {months.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        {/* Target Input Field */}
                        <div className="mb-4">
                            <label className="mb-2">Target Value</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter amount or count"
                                style={{ background: theme.inputBg, color: theme.text, border: `1px solid ${theme.border}` }}
                                onChange={(e) => setTargetValue(e.target.value)}
                            />
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-success px-4" onClick={handleSave}>Set Target</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Target;