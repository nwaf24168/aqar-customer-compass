
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut } from 'lucide-react';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border h-16 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">شركة الرمز العقارية</h2>
        <p className="text-sm text-muted-foreground">منصة إدارة راحة العملاء</p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className="font-medium">{currentUser?.username || 'nawaf'}</span>
          <span className="text-xs text-muted-foreground">مدير النظام</span>
        </div>
        
        <UserCircle className="h-8 w-8 text-primary" />
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={logout}
          title="تسجيل الخروج"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
