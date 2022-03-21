import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Register from './pages/Register';

function App() {
  console.log('here');
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/:file' element={<NotFound />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
