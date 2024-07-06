import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Layout from "./components/layout";
// import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Home from './components/screens/Home';
import Dashboard from './components/screens/Dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
                 <Route exact path="/" element={<Login />} />
                 <Route exact path="/login" element={<Login />} />
                 <Route exact path="/signup" element={<SignUp />} />
                 <Route exact path="/home" element={<Home />} />
                 <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
        
      </Layout>
    </Router>
  );
}

export default App;
