
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileInput, 
  MessageSquare, 
  BarChart4, 
  Settings, 
  Package 
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-16 lg:w-64 bg-card border-l border-border shrink-0">
      <div className="h-16 flex items-center justify-center border-b border-border">
        <img 
          src="/lovable-uploads/d1162ea8-970f-4b8b-b651-c22e4e917827.png" 
          alt="الرمز العقارية" 
          className="h-10 w-10 object-contain"
        />
      </div>
      
      <nav className="p-2 flex flex-col gap-1">
        <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} text="لوحة التحكم" />
        <NavItem to="/data-entry" icon={<FileInput size={20} />} text="إدخال البيانات" />
        <NavItem to="/complaints" icon={<MessageSquare size={20} />} text="الشكاوى" />
        <NavItem to="/analytics" icon={<BarChart4 size={20} />} text="التحليلات" />
        <NavItem to="/settings" icon={<Settings size={20} />} text="الإعدادات" />
        <NavItem to="/delivery" icon={<Package size={20} />} text="قسم التسليم" />
      </nav>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const NavItem = ({ to, icon, text }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors
        ${isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}
      `}
    >
      {icon}
      <span className="hidden lg:inline">{text}</span>
    </NavLink>
  );
};

export default Sidebar;
