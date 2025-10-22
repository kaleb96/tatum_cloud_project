import { Home, Cloud, Shield, Settings } from "lucide-react";

interface SideBarProps {
  onSelect?: (menu: string) => void;
}

const SideBar = ({ onSelect }: SideBarProps) => {
  const menuItems = [
    { name: "Dashboard", icon: Home },
    { name: "Cloud", icon: Cloud },
    { name: "Security", icon: Shield },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside className="h-screen w-16 bg-[#0E1A2B] flex flex-col items-center py-4 space-y-4 text-white">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.name}
            onClick={() =>
              onSelect ? onSelect(item.name) : alert(`${item.name} 클릭됨`)
            }
            className="flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-blue-500 transition"
            title={item.name}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </aside>
  );
};

export default SideBar;
