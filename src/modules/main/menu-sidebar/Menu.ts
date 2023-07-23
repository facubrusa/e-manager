import { MenuItemProps } from "@app/interfaces/menu-sidebar";

export const MENU: MenuItemProps[] = [
  {
    name: "Dashboard",
    icon: "fas fa-tachometer-alt nav-icon",
    level: 1,
    path: "/",
  },
  {
    name: "Users",
    icon: "fas fa-users nav-icon",
    level: 1,
    children: [
      {
        name: "Create user",
        icon: "fas fa-plus nav-icon",
        path: "/create-user",
        level: 2,
      },
      {
        name: "List users",
        icon: "fas fa-th-list nav-icon",
        path: "/list-users",
        level: 2,
      },
    ],
  },
];