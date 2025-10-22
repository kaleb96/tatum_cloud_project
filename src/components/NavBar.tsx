interface NavBarProps {
  activeMenu: string;
  onSelect: (menu: string) => void;
}

const NavBar = ({ activeMenu, onSelect }: NavBarProps) => {
  const menuList = ["Cloud", "Cloud Group", "Cloud Watcher", "Schedule"];

  return (
    <nav className="w-full border-b bg-white mb-4">
      <ul className="flex items-center space-x-2 p-2">
        {menuList.map((menu) => {
          const isActive = activeMenu === menu;
          return (
            <li
              key={menu}
              onClick={() => onSelect(menu)}
              className={`px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition 
                ${
                  isActive
                    ? "bg-blue-100 text-blue-600 border border-blue-400"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {menu}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
