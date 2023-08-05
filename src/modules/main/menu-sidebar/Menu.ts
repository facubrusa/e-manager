import { MenuItemProps } from "@app/interfaces/menu-sidebar";

export const MENU: MenuItemProps[] = [
  {
    name: "Dashboard",
    icon: "fas fa-tachometer-alt nav-icon",
    level: 1,
    onlyAdmin: false,
    path: "/",
  },
  {
    name: "Users",
    icon: "fas fa-users nav-icon",
    level: 1,
    onlyAdmin: false,
    children: [
      {
        name: "Create user",
        icon: "fas fa-plus nav-icon",
        path: "/users/add",
        level: 2,
        onlyAdmin: true,
      },
      {
        name: "List users",
        icon: "fas fa-th-list nav-icon",
        path: "/users/list",
        level: 2,
        onlyAdmin: false,
      },
    ],
  },
  {
    name: "Categories",
    icon: "fas fa-sitemap nav-icon",
    level: 1,
    onlyAdmin: false,
    children: [
      {
        name: "Create category",
        icon: "fas fa-plus nav-icon",
        path: "/categories/add",
        level: 2,
        onlyAdmin: true,
      },
      {
        name: "Active categories",
        icon: "fas fa-th-list nav-icon",
        path: "/categories/list/active",
        level: 2,
        onlyAdmin: false,
      },
      {
        name: "Inactive categories",
        icon: "fas fa-th-list nav-icon",
        path: "/categories/list/inactive",
        level: 2,
        onlyAdmin: false,
      },
    ],
  },
];