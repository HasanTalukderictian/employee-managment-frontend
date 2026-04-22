import './App.css'
import AdminLogin from './Components/Common/AdminLogin'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Page/Home';
import Employee from './Components/Page/Employee';
import Department from './Components/Page/Department';
import Desgination from './Components/Page/Desgination';
import Salary from './Components/Page/Salary';
import Leave from './Components/Page/Leave';
import Users from './Components/Page/Users';
import AddDepartment from './Components/Page/AddDepartment';
import AddDesgination from './Components/Page/AddDesgination';
import AddEmployee from './Components/Page/AddEmployee';
import ViewEmployee from './Components/Page/ViewEmployee';
import EditEmployee from './Components/Page/EditEmployee';
import AddUser from './Components/Page/AddUser';
import AddSalary from './Components/Page/AddSalary';
import Attendance from './Components/Page/Attendance';
import Task from './Components/Page/Task';
import UserLogin from './Components/Page/UserLogin';
import { useEffect, useState } from 'react';
import ProtectedRoute from './Components/Page/ProtectedRoute';
import Target from './Components/Page/Target';

function App() {
  const [role, setRole] = useState('guest');
  const [isExpanded, setIsExpanded] = useState(true);
  
  // LocalStorage থেকে থিম রিড করা যাতে রিফ্রেশ করলে চলে না যায়
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
    
    // থিম চেঞ্জ হলে বডি কালার চেঞ্জ করা (অপশনাল কিন্তু ভালো)
    document.body.style.backgroundColor = darkMode ? '#0f172a' : '#f8f9fa';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // কমন প্রপস অবজেক্ট (কোড ক্লিন রাখার জন্য)
  const commonProps = { 
    darkMode, 
    setDarkMode, 
    isExpanded, 
    setIsExpanded 
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AdminLogin />} />
        <Route path='/login' element={<UserLogin />} />

        {/* সব রাউটে commonProps পাস করা হয়েছে */}
        <Route path='/admin-home' element={<Home {...commonProps} />} />
        <Route path='/admin-employee' element={<Employee {...commonProps} />} />
        <Route path="/employee/view/:id" element={<ViewEmployee {...commonProps} />} />
        <Route path='/admin-department' element={<Department {...commonProps} />} />
        <Route path='/admin-users' element={<Users {...commonProps} />} />
        <Route path='/employee/edit/:id' element={<EditEmployee {...commonProps} />} />
        <Route path='/admin-add-department' element={<AddDepartment {...commonProps} />} />
        <Route path='/admin-add-salary' element={<AddSalary {...commonProps} />} />
        <Route path='/admin-add-desgination' element={<AddDesgination {...commonProps} />} />
        <Route path='/admin-add-employee' element={<AddEmployee {...commonProps} />} />
        <Route path='/admin-desgination' element={<Desgination {...commonProps} />} />
        <Route path='/admin-salary' element={<Salary {...commonProps} />} />
        <Route path='/admin-leave' element={<Leave {...commonProps} />} />
        <Route path='/admin-task' element={<Task {...commonProps} />} />
         <Route path='/admin-target' element={<Target {...commonProps} />} />
        <Route path='/admin-add-users' element={<AddUser {...commonProps} />} />
        <Route path='/admin-attendance' element={<Attendance {...commonProps} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;