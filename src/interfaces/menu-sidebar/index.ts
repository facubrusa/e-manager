export interface MenuItemProps {
  name: string;
  icon: string;
  path?: string;
  children?: MenuItemProps[];
  level: number;
  onlyAdmin: boolean;
}

export interface SidebarMenuItemProps {
  menuItem: MenuItemProps;
}
