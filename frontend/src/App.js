import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Layout from "./components/layout";
import LandingPage from './components/screens/LandingPage';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/screens/Dashboard';
import Song from './components/screens/Song';
import Data from './components/screens/Data';
import Home from './components/screens/Home';
import Playlist from './components/screens/Playlist';
import Upload from './components/screens/Upload';
import Search from './components/screens/Search';
import Profile from './components/screens/Profile';
import ForgotPassword from './components/screens/ForgotPassword';
import Pro from './components/screens/Pro';


function App() {

  return (
    <Router>
      <Layout>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/song" element={<Song />} />
          <Route exact path="/data" element={<Data />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/playlist" element={<Playlist />} />
          <Route exact path="/upload" element={<Upload />} />
          <Route exact path="/search" element={<Search />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/forgotpassword" element={<ForgotPassword />} />
          <Route exact path="/pro" element={<Pro />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
