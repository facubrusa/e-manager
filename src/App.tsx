import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Main from '@modules/main/Main';
import Login from './components/login/Login';

import Dashboard from '@pages/Dashboard';

import { useWindowSize } from '@app/hooks/useWindowSize';
import { calculateWindowSize } from '@app/utils/helpers';
import { setWindowSize } from '@app/store/reducers/ui';


import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import { setProfile, setToken } from './store/reducers/auth';
import {
  getLoginData,
} from './utils/oidc-providers';
import { ToastContainer } from 'react-toastify';
import CreateUser from './components/users/CreateUser';
import ListUsers from './components/users/ListUsers';

const App = () => {
  const windowSize = useWindowSize();
  const screenSize = useSelector((state: any) => state.ui.screenSize);
  const dispatch = useDispatch();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Check session
    getLoginData()
    .then((response: any) => {
      if (!response) {
        throw new Error('Error getting authStatus');
      }
      dispatch(setToken(response.token));
      dispatch(setProfile(response.profile));
    })
    .catch((error) => console.log(error))
    .finally(() => setIsAppLoading(false))
  }, []);

  useEffect(() => {
    const size = calculateWindowSize(windowSize.width);
    if (screenSize !== size) {
      dispatch(setWindowSize(size));
    }
  }, [windowSize]);

  if (isAppLoading) {
    return <p>Loading</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Main />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/list-users" element={<ListUsers />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer
        autoClose={3000}
        draggable={false}
        position="top-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
      />
    </BrowserRouter>
  );
};

export default App;