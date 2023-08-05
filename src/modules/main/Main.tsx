import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import ControlSidebar from '@app/modules/main/control-sidebar/ControlSidebar';
import Footer from '@app/modules/main/footer/Footer';
import Header from '@app/modules/main/header/Header';
import MenuSidebar from '@app/modules/main/menu-sidebar/MenuSidebar';
import { toggleSidebarMenu } from '@app/store/reducers/ui';
import { addWindowClass, removeWindowClass } from '@app/utils/helpers';
import { PfImage } from '@profabric/react-components';

const Main = () => {
  const dispatch = useDispatch();
  const menuSidebarCollapsed = useSelector(
    (state: any) => state.ui.menuSidebarCollapsed
  );
  const controlSidebarCollapsed = useSelector(
    (state: any) => state.ui.controlSidebarCollapsed
  );
  const screenSize = useSelector((state: any) => state.ui.screenSize);
  const token = useSelector((state: any) => state.auth.token);
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  useEffect(() => {
    setIsAppLoaded(Boolean(token));
  }, [token]);

  useEffect(() => {
    removeWindowClass('register-page');
    removeWindowClass('login-page');
    removeWindowClass('hold-transition');

    addWindowClass('sidebar-mini');

    return () => {
      removeWindowClass('sidebar-mini');
    };
  }, []);

  useEffect(() => {
    removeWindowClass('sidebar-closed');
    removeWindowClass('sidebar-collapse');
    removeWindowClass('sidebar-open');
    if (menuSidebarCollapsed && screenSize === 'lg') {
      addWindowClass('sidebar-collapse');
    } else if (menuSidebarCollapsed && screenSize === 'xs') {
      addWindowClass('sidebar-open');
    } else if (!menuSidebarCollapsed && screenSize !== 'lg') {
      addWindowClass('sidebar-closed');
      addWindowClass('sidebar-collapse');
    }
  }, [screenSize, menuSidebarCollapsed]);

  useEffect(() => {
    if (controlSidebarCollapsed) {
      removeWindowClass('control-sidebar-slide-open');
    } else {
      addWindowClass('control-sidebar-slide-open');
    }
  }, [screenSize, controlSidebarCollapsed]);

  const getAppTemplate = useCallback(() => {
    if (!isAppLoaded) {
      return (
        <div className='preloader flex-column justify-content-center align-items-center'>
          <PfImage
            className='animation__shake'
            src='/img/logo.png'
            alt='AdminLTELogo'
            height={60}
            width={60}
          />
        </div>
      );
    }
    return (
      <>
        <Header />

        <MenuSidebar />

        <div className='content-wrapper'>
          <div className='pt-3'></div>
          <Outlet />
        </div>
        <Footer />
        <ControlSidebar />
        <div
          id='sidebar-overlay'
          role='presentation'
          onClick={handleToggleMenuSidebar}
        />
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAppLoaded]);

  return <div className='wrapper'>{getAppTemplate()}</div>;
};

export default Main;
