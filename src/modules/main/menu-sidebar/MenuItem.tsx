import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Location, useLocation, useNavigate } from 'react-router-dom';

import { MenuItemProps } from '@app/interfaces/menu-sidebar';

const MenuItem = ({ menuItem }: { menuItem: MenuItemProps }) => {
  const [isMenuExtended, setIsMenuExtended] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const [isMainActive, setIsMainActive] = useState(false);
  const [isOneOfChildrenActive, setIsOneOfChildrenActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { role } = useSelector((state: any) => state.auth.profile);

  const toggleMenu = () => {
    setIsMenuExtended(!isMenuExtended);
  };

  const handleMainMenuAction = () => {
    if (isExpandable) {
      toggleMenu();
      return;
    }
    navigate(menuItem.path ? menuItem.path : '/');
  };

  const calculateIsActive = (url: Location) => {
    setIsMainActive(false);
    setIsOneOfChildrenActive(false);
    if (isExpandable && menuItem && menuItem.children) {
      menuItem.children.forEach((item) => {
        if (item.path === url.pathname) {
          setIsOneOfChildrenActive(true);
          setIsMenuExtended(true);
        }
      });
    } else if (menuItem.path === url.pathname) {
      setIsMainActive(true);
    }
  };

  useEffect(() => {
    if (location) {
      calculateIsActive(location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, isExpandable, menuItem]);

  useEffect(() => {
    if (!isMainActive && !isOneOfChildrenActive) {
      setIsMenuExtended(false);
    }
  }, [isMainActive, isOneOfChildrenActive]);

  useEffect(() => {
    setIsExpandable(
      Boolean(menuItem && menuItem.children && menuItem.children.length > 0)
    );
  }, [menuItem]);

  const hasChildren = menuItem.children && menuItem.children.length > 0;
  let marginLeft = '';
  switch (menuItem.level) {
    case 1:
      marginLeft = '';
      break;
    case 2:
      marginLeft = 'ml-2';
      break;
    case 3:
      marginLeft = 'ml-4';
      break;
  }
  return (
    <li className={`nav-item${isMenuExtended ? ' menu-open' : ''}`}>
      <a
        className={`nav-link${
          isMainActive || isOneOfChildrenActive ? ' active' : ''
        }`}
        role='link'
        onClick={handleMainMenuAction}
        style={{ cursor: 'pointer' }}
      >
        <i className={`${menuItem.icon} ${marginLeft}`} />
        <p>{menuItem.name}</p>
        {hasChildren ? <i className='right fas fa-angle-left' /> : null}
      </a>

      {hasChildren && (
        <ul className='nav nav-treeview'>
          {menuItem.children &&
            menuItem.children.map((child: MenuItemProps, index: number) => {
              if (child.onlyAdmin && role === 'user') return;
              return <MenuItem key={index} menuItem={child} />;
            })}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;
