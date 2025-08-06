import Header from './Header';
import Footer from './Footer';
import Menu from './Menu';
import '../../index.css';
import { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

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
        const totalEarning = data.salary?.reduce((sum, item) => sum + parseFloat(item.basic), 0) || 0;
        setStats({
          earning: totalEarning,
          departments: data.department?.length || 0,
          employees: data.employee?.length || 0,
          users: data.usersmodel?.length || 0,
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
          {/* Header with title and live time */}
          <div
            style={{
              position: 'relative',
              marginBottom: '2.5rem',
              height: '2.5rem', // enough height to vertically center
             
            }}
          >
            <h2
              className="mb-0"
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                margin: 0,
                top: '50%',
                transformOrigin: 'center',
              }}
            >
              Welcome to the Dashboard
            </h2>
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.25rem',
                fontWeight: 500,
                color: '#333',
              }}
            >
              <LiveTime />
            </div>
          </div>


          {/* Top Stats Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div
                className="d-flex align-items-center justify-content-start text-white p-4 rounded shadow"
                style={{ background: 'linear-gradient(135deg, #000000ff, #0a0b0bff)' }}
              >
                <i className="bi bi-cash-stack fs-1 me-3"></i>
                <div>
                  <div className="h4">Salary</div>
                  <div className="h4">${stats.earning.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div
                className="d-flex align-items-center justify-content-start p-4 rounded shadow"
                style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}
              >
                <i className="bi bi-diagram-3-fill fs-1 text-primary me-3"></i>
                <div>
                  <div className="h4">Departments</div>
                  <div className="h4">{stats.departments}</div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div
                className="d-flex align-items-center justify-content-start p-4 rounded shadow"
                style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}
              >
                <i className="bi bi-people-fill fs-1 text-success me-3"></i>
                <div>
                  <div className="h4">Employees</div>
                  <div className="h4">{stats.employees}</div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div
                className="d-flex align-items-center justify-content-start p-4 rounded shadow"
                style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}
              >
                <i className="bi bi-person-check-fill fs-1 text-warning me-3"></i>
                <div>
                  <div className="h4">Users</div>
                  <div className="h4">{stats.users}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart Section */}
          <div className="bg-white border rounded p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Result</h5>
              <button className="btn btn-warning btn-sm">Check Now</button>
            </div>
            <div className="p-3 bg-light">
              <BarChart />
            </div>
          </div>

          {/* Line Chart and Calendar */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div
                className="bg-white border rounded p-4 text-center text-muted"
                style={{ height: '200px' }}
              >
                [Line Chart Placeholder]
              </div>
            </div>
            <div className="col-md-6">
              <div
                className="bg-white border rounded p-4 text-center text-muted"
                style={{ height: '200px' }}
              >
                [Calendar Placeholder]
              </div>
            </div>
          </div>

          {/* Circle Progress and List */}
          <div className="bg-white border rounded p-4" style={{ maxWidth: '300px' }}>
            <div
              className="text-center text-muted mb-3"
              style={{
                height: '120px',
                lineHeight: '120px',
                backgroundColor: '#f0f0f0',
                borderRadius: '50%',
              }}
            >
              45%
            </div>
            <ul className="list-unstyled small">
              <li className="mb-1">Lorem ipsum</li>
              <li className="mb-1">Lorem ipsum</li>
              <li className="mb-1">Lorem ipsum</li>
              <li className="mb-1">Lorem ipsum</li>
            </ul>
            <div className="text-center">
              <button className="btn btn-warning btn-sm mt-2">Check Now</button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
