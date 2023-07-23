import { MENU } from "@app/modules/main/menu-sidebar/Menu";
import { PfDropdown } from "@profabric/react-components";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const StyledDropdown = styled(PfDropdown)<{ $isOpen: boolean, $openOnButtonClick: boolean }>`
  border: none;
  width: 100%;
  display: flex;
  padding: 0;
  justify-content: center;
  align-items: center;
  --pf-dropdown-menu-min-width: 14.625rem;
  --pf-dropdown-border: none;
  --pf-dropdown-menu-margin-top: 0px;

  .menu {
    background-color: #454d55;
  }

  .dropdown-item {
    padding: 0.5rem 1rem;
  }

  .nothing-found {
    color: #c2c7d0;
    padding: 0.25rem 0.5rem;
  }

  .list-group {
    .list-group-item {
      padding: 0.5rem 0.75rem;
      cursor: pointer;
    }

    .search-path {
      font-size: 80%;
      color: #adb5bd;
    }
  }
`;

export interface IMenuItem {
  name: string;
  icon: string;
  path?: string;
  children?: Array<IMenuItem>;
}

export const SidebarSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [foundMenuItems, setFoundMenuItems] = useState<any[]>([]);
  const dropdown = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setFoundMenuItems([]);
    if (searchText) {
      setFoundMenuItems(findMenuItems(MENU));
    } else {
      setSearchText("");
      setFoundMenuItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  useEffect(() => {
    if (foundMenuItems && foundMenuItems.length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [foundMenuItems]);

  const handleIconClick = () => {
    setSearchText("");
    setIsDropdownOpen(false);
  };

  const handleMenuItemClick = () => {
    setSearchText("");
    setIsDropdownOpen(false);
  };

  const findMenuItems = (menu: any, results: any = []): any[] => {
    // eslint-disable-next-line no-restricted-syntax
    for (const menuItem of menu) {
      if (menuItem.name.includes(searchText) && menuItem.path) {
        results.push(menuItem);
      }
      if (menuItem.children) {
        return findMenuItems(menuItem.children, results);
      }
    }
    return results;
  };

  const boldString = (str: string, substr: string) => {
    return str.replace(
      substr,
      `<strong class="text-light">${substr}</strong>`
    );
  };

  return (
    <StyledDropdown
      ref={dropdown}
      $isOpen={isDropdownOpen}
      hide-arrow
      $openOnButtonClick={false}
    >
      <div slot="button">
        <div className="input-group">
          <input
            className="form-control form-control-sidebar"
            type="text"
            id="sidebar-search"
            placeholder="Search"
            aria-label="Search"
            value={searchText}
            onInput={(e) => setSearchText((e.target as any).value)}
          />
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-sidebar"
              onClick={() => handleIconClick()}
            >
              <i
                className={`fas ${searchText.length > 0 ? "fa-times" : "fa-search"} fa-fw`}
              />
            </button>
          </div>
        </div>
      </div>
      <div className="menu" slot="menu">
        {foundMenuItems && foundMenuItems.length === 0 && (
          <div className="nothing-found">No Element found</div>
        )}
        {foundMenuItems.length > 0 && (
          <div className="list-group">
            {foundMenuItems &&
              foundMenuItems.map((menuItem: IMenuItem) => (
                <NavLink
                  key={`${menuItem.name} ${menuItem.path || ''}`}
                  className="list-group-item"
                  to={menuItem.path || ''}
                  onClick={() => handleMenuItemClick()}
                >
                  <div
                    className="search-title"
                    dangerouslySetInnerHTML={{
                      __html: boldString(menuItem.name, searchText),
                    }}
                  />
                  <div className="search-path">{menuItem.name}</div>
                </NavLink>
              ))}
          </div>
        )}
      </div>
    </StyledDropdown>
  );
};
