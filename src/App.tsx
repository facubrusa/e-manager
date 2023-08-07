import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useWindowSize } from '@app/hooks/useWindowSize';
import { setWindowSize } from '@app/store/reducers/ui';
import { calculateWindowSize } from '@app/utils/helpers';
import Main from '@modules/main/Main';
import Dashboard from '@pages/Dashboard';

import AddEditCategories from './components/categories/AddEdit';
import ListCategories from './components/categories/List';
import Login from './components/login/Login';
import AddEditUsers from './components/users/AddEdit';
import ListUsers from './components/users/List';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import { setProfile, setToken } from './store/reducers/auth';
import { getLoginData } from './utils/oidc-providers';

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
      .finally(() => setIsAppLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const size = calculateWindowSize(windowSize.width);
    if (screenSize !== size) {
      dispatch(setWindowSize(size));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowSize]);

  if (isAppLoading) {
    return <p>Loading</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<PublicRoute />}>
          <Route path='/login' element={<Login />} />
        </Route>
        <Route path='/' element={<PrivateRoute />}>
          <Route path='/' element={<Main />}>
            <Route path='/' element={<Dashboard />} />
            {/* Users */}
            <Route path={`users/list`} element={<ListUsers />} />
            <Route path={`users/add`} element={<AddEditUsers />} />
            <Route path={`users/edit/:id`} element={<AddEditUsers />} />
            {/* Categories */}
            <Route
              path={`categories/list/active`}
              element={<ListCategories active={true} />}
            />
            <Route
              path={`categories/list/inactive`}
              element={<ListCategories active={false} />}
            />
            <Route path={`categories/add`} element={<AddEditCategories />} />
            <Route path={`categories/edit/:id`} element={<AddEditCategories />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer
        autoClose={3000}
        draggable={false}
        position='top-right'
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
