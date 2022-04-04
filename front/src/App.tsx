import React, {useEffect} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import {RecoilRoot, useRecoilValue, useRecoilState} from 'recoil';

import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import User from './pages/User';
import Admin from './pages/Admin'
import { user } from './recoil/atom';
import { ToastContainer } from 'react-toastify';
import Api from "src/utils/api";
import Search from "src/pages/Search";

function AuthRoute()  {
  const auth = useRecoilValue(user);

  return auth ? <Navigate to="/" /> : <Outlet />
}

function HomeRoute()  {
  const auth = useRecoilValue(user);

  return auth ? <Outlet /> : <Navigate to="/login" />
}

function Navigation() {
  const [auth, setAuth] = useRecoilState(user);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const user = await Api.profile();

        setAuth(user);
      } catch { setAuth(null) }
    }

    fetchAuth();
  }, [setAuth])

  return auth !== undefined ? <Router>
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
      <Route path='/admin' element={<HomeRoute />}>
        <Route path='/admin' element={<Admin />} />
      </Route>
      <Route path='/list/:list' element={<HomeRoute />}>
        <Route path='/list/:list' element={<Home />} />
      </Route>
      <Route path='/user/me' element={<HomeRoute />}>
        <Route path='/user/me' element={<User />} />
      </Route>

      <Route path='/public/:list' element={<Home publicList={true} />} />
      <Route path='/search' element={<Search />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  </Router> : ( <div style={{ padding: '30px' }}>loading...</div> )
}

function App() {
  return (
    <div style={{ height: '100%' }}>
      <RecoilRoot>
        <Navigation />
        <ToastContainer />
      </RecoilRoot>
    </div>
  );
}

export default App;
