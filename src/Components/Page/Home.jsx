import Header from './Header';
import Footer from './Footer';
import Menu from './Menu';
import '../../index.css';
import { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import {  Link } from 'react-router-dom'; // <-- Make sure this is imported

// LiveTime component to show live clock
const LiveTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontSize: '1.25rem', fontWeight: '500', color: '#333' }}>
      {time.toLocaleTimeString()}
    </div>
  );
};

// LineChart Component
const LineChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
          {
            label: 'Visitors',
            data: [30, 45, 28, 60, 42, 75, 50, 90],
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13, 110, 253, 0.2)',
            tension: 0.4, // smooth curve
            fill: true,
            pointBackgroundColor: '#0d6efd',
          },
          {
            label: 'Sales',
            data: [10, 25, 18, 40, 30, 55, 35, 70],
            borderColor: '#e0a800',
            backgroundColor: 'rgba(224, 168, 0, 0.2)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#e0a800',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }, []);

  return <canvas ref={chartRef} height={100} />;
};


// BarChart Component
const BarChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
          {
            label: '2020',
            data: [20, 35, 30, 25, 40, 50, 30, 35],
            backgroundColor: '#e0a800',
          },
          {
            label: '2021',
            data: [15, 25, 22, 30, 28, 45, 25, 40],
            backgroundColor: '#0d6efd',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  return <canvas ref={chartRef} height={100} />;
};

// Home Component
const Home = () => {
  const [stats, setStats] = useState({
    earning: 0,
    departments: 0,
    employees: 0,
    users: 0,
  });
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/get-all-data`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Data', data); // now logs after fetch & JSON parsing

        const totalEarning =
          data.salary?.reduce((sum, item) => sum + parseFloat(item.basic), 0) || 0;

        setStats({
          earning: totalEarning,
          departments: data.department?.length || 0,
          employees: data.employee?.length || 0,
          users: data.usersmodel?.length || 0,
          task: data.task?.length || 0,
        });
      })
      .catch((err) => console.error('Error loading dashboard data:', err));
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '1890px',
        height: '1024px',
        margin: '0 auto',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
      }}
    >
      <Header />
      <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Menu />
        <main
          style={{
            flexGrow: 1,
            padding: '40px',
            background: '#f0eee7',
            overflowY: 'auto',
          }}
        >

          {/* Top Stats Cards with links */}



          <div className="p-4 rounded shadow-sm mb-3" style={{ backgroundColor: 'white' }}>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Dashboard</h2>
              <div style={{ fontSize: '1.25rem', fontWeight: 500, color: '#333' }}>
                <LiveTime />
              </div>
            </div>

            {/* Row of cards */}
            <div className="row g-4">

              {/* Salary */}
              <div className="col-md-3">
                <Link to="/admin-salary" className="text-decoration-none">
                  <div className="p-4 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #d6e0ff, #f0f4ff)' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-white rounded-circle shadow d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                        <i className="bi bi-cash-stack fs-4 text-primary"></i>

                      </div>
                      <div className="h4 text-dark mb-0">Salary</div>
                    </div>
                    <div className="h4 fw-bold text-dark">${stats.earning.toLocaleString()}</div>
                    <small className="text-muted">All Salary</small>
                  </div>
                </Link>
              </div>

              {/* Departments */}
              <div className="col-md-3">
                <Link to="/admin-department" className="text-decoration-none">
                  <div className="p-4 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #d0ebff, #f0f9ff)' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-white rounded-circle shadow d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                        <i className="bi bi-mortarboard-fill fs-4 text-info"></i>
                      </div>
                      <div className="h4 text-dark">Departments</div>

                    </div>

                    <div className="h4 text-dark">{stats.departments}</div>
                    <small className="text-muted">Registered Departments</small>
                  </div>
                </Link>
              </div>

              {/* Employees */}
              <div className="col-md-3">
                <Link to="/admin-employee" className="text-decoration-none">
                  <div className="p-4 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #f3d9fa, #f8eaff)' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-white rounded-circle shadow d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>

                        <i className="bi bi-people-fill fs-4 text-success"></i>
                      </div>
                      <div className="h4 text-dark">Employees</div>

                    </div>

                    <div className="h4 text-dark">{stats.employees}</div>
                    <div className="fw-semibold text-dark">Total Employees</div>

                  </div>
                </Link>
              </div>

              {/* Users */}
              <div className="col-md-3">
                <Link to="/admin-users" className="text-decoration-none">
                  <div className="p-4 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #ffe5d9, #fff4f0)' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-white rounded-circle shadow d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                        <i className="bi bi-person-fill fs-4 text-purple"></i>
                      </div>
                      <div className="h4 text-dark">Users</div>

                    </div>
                    <div className="h4 text-dark">{stats.users}</div>
                    <div className="fw-semibold text-dark">Total Users</div>

                  </div>
                </Link>
              </div>

              {/* Total ongoing Task */}
              <div className="col-md-3">
                <Link to="/admin-task" className="text-decoration-none">
                  <div className="p-4 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #e9f7ef, #f4fff7)' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-white rounded-circle shadow d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                        <i className="bi bi-check2-circle fs-4 text-success"></i>
                      </div>
                      <div className="fs-5 fw-bold text-dark">{stats.task || 0}</div>
                    </div>
                    <div className="fw-semibold text-dark">Tasks</div>
                    <small className="text-muted">On Going Tasks</small>
                  </div>
                </Link>
              </div>

              {/* Total Leads */}
              <div className="col-md-3">
                <Link to="/leads" className="text-decoration-none">
                  <div className="p-4 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #d3f9d8, #f0fff4)' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-white rounded-circle shadow d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                        <i className="bi bi-people-fill fs-4 text-success"></i>
                      </div>
                      <div className="fs-5 fw-bold text-dark">{stats.leads || 0}</div>
                    </div>
                    <div className="fw-semibold text-dark">Total Leads</div>
                    <small className="text-muted">All leads</small>
                  </div>
                </Link>
              </div>

              {/* New Leads */}
              <div className="col-md-3">
                <Link to="/recent-leads" className="text-decoration-none">
                  <div className="p-4 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #f4fce3, #fdfff4)' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-white rounded-circle shadow d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                        <i className="bi bi-graph-up-arrow fs-4 text-success"></i>
                      </div>
                      <div className="fs-5 fw-bold text-dark">{stats.newLeads || 0}</div>
                    </div>
                    <div className="fw-semibold text-dark">New Leads</div>
                    <small className="text-muted">Recent leads</small>
                  </div>
                </Link>
              </div>

              {/* Branches */}
              <div className="col-md-3">
                <Link to="/branches" className="text-decoration-none">
                  <div className="p-4 rounded shadow-sm" style={{ background: 'linear-gradient(135deg, #fff3bf, #fff9e6)' }}>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-white rounded-circle shadow d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                        <i className="bi bi-building fs-4 text-warning"></i>
                      </div>
                      <div className="fs-5 fw-bold text-dark">{stats.branches || 0}</div>
                    </div>
                    <div className="fw-semibold text-dark">Total Branches</div>
                    <small className="text-muted">All branches</small>
                  </div>
                </Link>
              </div>

              {/* Repeat for other cards... */}

            </div>
          </div>





          {/* Parallel Chart Section */}
          <div className="row g-4 mb-4">
            {/* Bar Chart */}
            <div className="col-md-6">
              <div className="bg-white border rounded p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Result</h5>
                  <button className="btn btn-warning btn-sm">Check Now</button>
                </div>
                <div className="p-3 bg-light">
                  <BarChart />
                </div>
              </div>
            </div>

            {/* Line Chart + Calendar */}
            <div className="col-md-6">
              <div className="row g-4">
                <div className="col-12">

                  <div className="col-12">
                    <div className="bg-white border rounded p-4" style={{ height: '350px' }}>
                      <LineChart />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>



        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
