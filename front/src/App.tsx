import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { RecoilRoot, useRecoilValue } from 'recoil';

import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import User from './pages/User';
import { user } from './recoil/atom';
import { ToastContainer, toast } from 'react-toastify';

function AuthRoute()  {
  const auth = useRecoilValue(user);

  return auth ? <Navigate to="/" /> : <Outlet />
}

function HomeRoute()  {
  const auth = useRecoilValue(user);

  return auth ? <Outlet /> : <Navigate to="/login" />
}

function Navigation() {
  return <Router>
    <Routes>
      <Route path='/login' element={<AuthRoute />}>
        <Route path='/login' element={<Login />} />
      </Route>
      <Route path='/register' element={<AuthRoute />}>
        <Route path='/register' element={<Register />} />
      </Route>

      <Route path='/' element={<HomeRoute />}>
        <Route path='/' element={<Home />} />
      </Route>
      <Route path='/:file' element={<HomeRoute />}>
        <Route path='/:file' element={<NotFound />} />
      </Route>

      <Route path='/user/:username' element={<User />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  </Router>
}

function App() {
  return (
    <RecoilRoot>
      <Navigation />
      <ToastContainer />
    </RecoilRoot>
  );
}

export default App;
