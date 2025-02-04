import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Dashboard from './pages/Dashboard'
import Inicio from './pages/Inicio';
import Modelo1 from './pages/Modelo1';
import Modelo2 from './pages/Modelo2';
import ProtectedRoute from './lib/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="modelo1" element={<Modelo1 />} />
            <Route path="modelo2" element={<Modelo2 />} />
          </Route>
          <Route path="*" element={<NotFound />} /> 

        </Routes>
      </Router>

    </>
  )
}

export default App
