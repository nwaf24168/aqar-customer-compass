import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    // For demo purposes - calling login with username and password separately
    login('admin', 'admin123');
    
    toast({
      title: "تم تسجيل الدخول",
      description: "مرحباً بك في منصة إدارة تجربة العملاء",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 bg-card/80 backdrop-blur">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">منصة إدارة تجربة العملاء</h1>
          <p className="text-muted-foreground">شركة الرمز العقارية</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium">اسم المستخدم</label>
            <input
              id="username"
              type="text"
              className="w-full p-2 rounded border bg-background"
              defaultValue="admin"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">كلمة المرور</label>
            <input
              id="password"
              type="password"
              className="w-full p-2 rounded border bg-background"
              defaultValue="admin123"
            />
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleLogin}
          >
            تسجيل الدخول
          </Button>
        </div>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p className="mt-2">يمكنك تسجيل الدخول باستخدام اسم المستخدم: admin وكلمة المرور: admin123</p>
        </div>
      </Card>
    </div>
  );
};

export default Index;
