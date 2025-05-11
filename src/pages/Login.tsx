
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: (err as Error).message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center mb-10">
        <img 
          src="/lovable-uploads/0b5c775c-5fa8-48b7-a6aa-f9e988a703a3.png" 
          alt="شركة الرمز العقارية"
          className="w-32 h-32 mx-auto mb-8"
        />
        
        <h1 className="text-3xl font-bold mb-2">مرحباً بك في منصة قسم إدارة راحة العملاء</h1>
        <h2 className="text-xl text-muted-foreground">شركة الرمز العقارية</h2>
      </div>
      
      <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-right font-medium">
              اسم المستخدم
            </label>
            <Input
              id="username"
              placeholder="أدخل اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-secondary/50"
              required
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-right font-medium">
              كلمة المرور
            </label>
            <Input
              id="password"
              type="password"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary/50"
              required
              dir="rtl"
            />
          </div>

          {error && (
            <div className="bg-destructive/20 text-destructive p-3 rounded-md text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/80"
            disabled={loading}
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </Button>
        </form>
      </Card>

      <div className="mt-8 text-muted-foreground text-sm">
        جميع الحقوق محفوظة © 2025 شركة الرمز العقارية
      </div>
    </div>
  );
};

export default Login;
