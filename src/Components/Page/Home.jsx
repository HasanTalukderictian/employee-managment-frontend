import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdTrendingUp } from "react-icons/io";
import { BsCashStack, BsMortarboardFill, BsPeopleFill, BsPersonFill, BsCheck2Circle, BsGraphUpArrow, BsBuilding } from "react-icons/bs";
import Chart from 'chart.js/auto';
import Header from './Header';
import Footer from './Footer';
import Menu from './Menu';
import '../../index.css';

// --- Chart Components ---
const LineChart = ({ darkMode }) => {
  const chartRef = useRef(null);
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Revenue',
          data: [4000, 5500, 5000, 7500, 9000, 8500, 11000],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#10b981',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }, ticks: { color: darkMode ? '#94a3b8' : '#64748b' } },
          x: { grid: { display: false }, ticks: { color: darkMode ? '#94a3b8' : '#64748b' } }
        }
      }
    });
    return () => chart.destroy();
  }, [darkMode]);
  return <canvas ref={chartRef} />;
};

const BarChart = ({ darkMode }) => {
  const chartRef = useRef(null);
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['HR', 'IT', 'Sales', 'Admin'],
        datasets: [{
          label: 'Staff',
          data: [12, 19, 15, 8],
          backgroundColor: ['#3b82f6', '#06b6d4', '#10b981', '#8b5cf6'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }, ticks: { color: darkMode ? '#94a3b8' : '#64748b' } },
          x: { grid: { display: false }, ticks: { color: darkMode ? '#94a3b8' : '#64748b' } }
        }
      }
    });
    return () => chart.destroy();
  }, [darkMode]);
  return <canvas ref={chartRef} />;
};

// --- Sub-components ---
const LiveTime = ({ darkMode }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      fontSize: '1rem', fontWeight: '700', 
      color: '#10b981',
      background: darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
      padding: '8px 20px', borderRadius: '50px',
      border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
    }}>
      {time.toLocaleTimeString()}
    </div>
  );
};

const StatCard = ({ to, title, value, sub, icon: Icon, color, darkMode, gradient }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardStyle = {
    background: darkMode ? 'rgba(30, 41, 59, 0.7)' : `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
    backdropFilter: 'blur(10px)',
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '24px',
    transition: 'all 0.4s ease',
    transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
    boxShadow: isHovered ? '0 15px 30px rgba(0,0,0,0.12)' : '0 4px 6px rgba(0,0,0,0.05)',
  };

  return (
    <div className="col-xl-3 col-md-6">
      <Link to={to} className="text-decoration-none">
        <div className="p-4 h-100" style={cardStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="d-flex justify-content-between">
            <div className="rounded-4 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', backgroundColor: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <Icon size={26} color={color} />
            </div>
            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
              <IoMdTrendingUp size={18} /> +12%
            </div>
          </div>
          <div className="mt-4">
            <h6 style={{ color: darkMode ? '#94a3b8' : '#64748b', fontWeight: '600' }}>{title}</h6>
            <h2 style={{ color: darkMode ? '#f8fafc' : '#1e293b', fontWeight: '800', margin: '0' }}>{value}</h2>
            <p className="mb-0 mt-1" style={{ fontSize: '0.85rem', color: darkMode ? '#64748b' : '#94a3b8' }}>{sub}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

// --- Main Component ---
const Home = ({ darkMode, setDarkMode, isExpanded, setIsExpanded }) => {
  const [stats, setStats] = useState({ earning: 0, departments: 0, employees: 0, users: 0, task: 0 });
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const theme = {
    bg: darkMode ? '#0f172a' : '#f8f9fa',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f8fafc' : '#1e293b',
    border: darkMode ? '#334155' : '#e2e8f0'
  };

  useEffect(() => {
    fetch(`${BASE_URL}/api/get-all-data`)
      .then((res) => res.json())
      .then((data) => {
        const totalEarning = data.salary?.reduce((sum, item) => sum + parseFloat(item.basic), 0) || 0;
        setStats({
          earning: totalEarning,
          departments: data.department?.length || 0,
          employees: data.employee?.length || 0,
          users: data.usersmodel?.length || 0,
          task: data.task?.length || 0,
        });
      })
      .catch((err) => console.error(err));
  }, [BASE_URL]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      minHeight: '100vh', 
      background: theme.bg, 
      color: theme.text, 
      boxSizing: 'border-box',
      transition: 'background 0.3s ease'
    }}>
      {/* Header receives darkMode and setDarkMode */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div style={{ display: 'flex', flexGrow: 1 }}>
        {/* Menu receives expand state */}
        <Menu darkMode={darkMode} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        
        {/* Main Content Area: Margin and Width adjust based on Sidebar */}
        <main style={{ 
          flexGrow: 1, 
          padding: '30px', 
          marginLeft: isExpanded ? '0px' : '0px', // Managed by flexbox
          transition: 'all 0.4s ease',
          width: '100%',
          overflowX: 'hidden'
        }}>
          
          {/* Dashboard Title & Time */}
          <div className="d-flex justify-content-between align-items-center mb-5 p-4 rounded-4 shadow-sm" 
               style={{ background: theme.cardBg, border: `1px solid ${theme.border}` }}>
            <div>
              <h2 className="fw-bold m-0" style={{ color: theme.text }}>Dashboard</h2>
              <p className="text-muted m-0" style={{ fontSize: '14px' }}>Welcome back to your management panel.</p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <LiveTime darkMode={darkMode} />
            </div>
          </div>

          {/* Stat Cards Grid - Row 1 */}
          <div className="row g-4 mb-4">
            <StatCard darkMode={darkMode} to="/admin-salary" title="Total Earning" value={`$${stats.earning.toLocaleString()}`} sub="Monthly Revenue" icon={BsCashStack} color="#3b82f6" gradient={['#dbeafe', '#eff6ff']} />
            <StatCard darkMode={darkMode} to="/admin-department" title="Departments" value={stats.departments} sub="Active Units" icon={BsMortarboardFill} color="#06b6d4" gradient={['#cffafe', '#ecfeff']} />
            <StatCard darkMode={darkMode} to="/admin-employee" title="Employees" value={stats.employees} sub="Total Staff" icon={BsPeopleFill} color="#10b981" gradient={['#dcfce7', '#f0fdf4']} />
            <StatCard darkMode={darkMode} to="/admin-users" title="System Users" value={stats.users} sub="Active Accounts" icon={BsPersonFill} color="#8b5cf6" gradient={['#ede9fe', '#f5f3ff']} />
          </div>

          {/* Stat Cards Grid - Row 2 */}
          <div className="row g-4 mb-5">
             <StatCard darkMode={darkMode} to="/admin-task" title="Ongoing Tasks" value={stats.task} sub="In Progress" icon={BsCheck2Circle} color="#f59e0b" gradient={['#fef3c7', '#fffbeb']} />
             <StatCard darkMode={darkMode} to="/recent-leads" title="New Leads" value="24" sub="Last 24 Hours" icon={BsGraphUpArrow} color="#ec4899" gradient={['#fce7f3', '#fdf2f8']} />
             <StatCard darkMode={darkMode} to="/branches" title="Branches" value="08" sub="Global Locations" icon={BsBuilding} color="#64748b" gradient={['#f1f5f9', '#f8fafc']} />
             <StatCard darkMode={darkMode} to="/analytics" title="Performance" value="92%" sub="Efficiency Rate" icon={IoMdTrendingUp} color="#10b981" gradient={['#dcfce7', '#f0fdf4']} />
          </div>

          {/* Charts Row */}
          <div className="row g-4 mb-4">
            <div className="col-xl-7 col-lg-12">
              <div className="p-4 rounded-4 shadow-sm" style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, height: '450px' }}>
                <h5 className="fw-bold mb-4">Revenue Growth Analysis</h5>
                <div style={{ height: '350px' }}><LineChart darkMode={darkMode} /></div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-12">
              <div className="p-4 rounded-4 shadow-sm" style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, height: '450px' }}>
                <h5 className="fw-bold mb-4">Staff by Department</h5>
                <div style={{ height: '350px' }}><BarChart darkMode={darkMode} /></div>
              </div>
            </div>
          </div>

        </main>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Home;