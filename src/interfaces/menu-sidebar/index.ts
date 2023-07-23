export interface MenuItemProps {
  name: string;
  icon: string;
  path?: string;
  children?: MenuItemProps[];
  level: number;
}

export interface SidebarMenuItemProps {
  menuItem: MenuItemProps;
}