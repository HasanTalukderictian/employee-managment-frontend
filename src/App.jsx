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

function App() {


  return (
    <>

    <BrowserRouter>
        <Routes>
                <Route path='/' element={<AdminLogin></AdminLogin>}></Route>
                <Route path='/admin-home' element={<Home></Home>}></Route>
                <Route path='/admin-employee' element={<Employee/>}></Route>
                 <Route path='/admin-employee' element={<Employee/>}></Route>
                  <Route path='/admin-department' element={<Department/>}></Route>
                   <Route path='/admin-desgination' element={<Desgination/>}></Route>
                    <Route path='/admin-salary' element={<Salary/>}></Route>
                    <Route path='/admin-leave' element={<Leave/>}></Route>
                     <Route path='/admin-users' element={<Users/>}></Route>
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
