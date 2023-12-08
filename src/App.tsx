import React from 'react';
import './App.css';
import Home from './pages/home';
import Login from './pages/login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddRecord from './pages/addRecord';
import AddPatient from './pages/addPatient';
import Patients from './pages/patients';
import Adduser from './pages/adduser';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Login /> } />
          <Route path='/home' element={<Home /> } />
          <Route path='/addRecord' element={<AddRecord /> } />
          <Route path='/addPatient' element={<AddPatient /> } />
          <Route path='/patients' element={<Patients />} />
          <Route path='/adduser' element={<Adduser />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
