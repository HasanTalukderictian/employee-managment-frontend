import './App.css'
import AdminLogin from './Components/Common/AdminLogin'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Page/Home';

function App() {


  return (
    <>

    <BrowserRouter>
        <Routes>
                <Route path='/' element={<AdminLogin></AdminLogin>}></Route>
                <Route path='/admin-home' element={<Home></Home>}></Route>
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
