
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/types';

// Mock user data
const mockUsers: User[] = [
  { id: '1', username: 'admin', role: 'admin', createdAt: '2024-05-01' },
  { id: '2', username: 'abdulsalam', role: 'manager', createdAt: '2024-05-02' },
  { id: '3', username: 'aljawharah', role: 'customer_service', createdAt: '2024-05-03' },
  { id: '4', username: 'khalood', role: 'customer_service', createdAt: '2024-05-04' },
  { id: '5', username: 'adnan', role: 'customer_service', createdAt: '2024-05-05' },
  { id: '6', username: 'lateefa', role: 'customer_service', createdAt: '2024-05-06' },
  { id: '7', username: 'nawaf', role: 'admin', createdAt: '2024-05-07' }
];

const roleTranslations: Record<string, string> = {
  'admin': 'مدير النظام',
  'manager': 'مدير إدارة راحة العملاء',
  'customer_service': 'موظف إدارة راحة العملاء',
  'maintenance': 'موظف صيانة'
};

const Settings = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleAddUser = (user: Partial<User>) => {
    const newUser: User = {
      id: String(users.length + 1),
      username: user.username || '',
      role: user.role || 'customer_service',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, newUser]);
    setIsAddUserDialogOpen(false);
    toast({
      title: 'تم إضافة المستخدم',
      description: `تم إضافة ${newUser.username} بنجاح`,
    });
  };

  const handleEditUser = (user: User) => {
    const updatedUsers = users.map(u => 
      u.id === user.id ? user : u
    );
    setUsers(updatedUsers);
    setIsEditUserDialogOpen(false);
    toast({
      title: 'تم تعديل المستخدم',
      description: `تم تعديل ${user.username} بنجاح`,
    });
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: 'تم حذف المستخدم',
      description: 'تم حذف المستخدم بنجاح',
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">إعدادات النظام</h1>
      </div>

      <div className="space-y-8">
        <Card className="bg-card/50 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">إدارة المستخدمين</h2>
              <Button onClick={() => setIsAddUserDialogOpen(true)}>
                إضافة مستخدم جديد
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              إضافة وتعديل وحذف مستخدمي النظام
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right py-3 px-4 font-medium">اسم المستخدم</th>
                    <th className="text-right py-3 px-4 font-medium">الصلاحية</th>
                    <th className="text-right py-3 px-4 font-medium">رمز الدخول</th>
                    <th className="text-right py-3 px-4 font-medium">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border">
                      <td className="py-3 px-4">{user.username}</td>
                      <td className="py-3 px-4">{roleTranslations[user.role] || user.role}</td>
                      <td className="py-3 px-4">••••••••</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditUserDialogOpen(true);
                            }}
                          >
                            <Edit size={18} />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 size={18} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  هل أنت متأكد من حذف المستخدم؟
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  سيتم حذف المستخدم {user.username} بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-secondary/30 p-6 border-t border-border">
            <h3 className="font-bold mb-4">إضافة مستخدم جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">اسم المستخدم</label>
                <Input placeholder="أدخل اسم المستخدم" />
              </div>
              <div>
                <label className="block text-sm mb-1">الصلاحية</label>
                <Select defaultValue="customer_service">
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الصلاحية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">مدير النظام</SelectItem>
                    <SelectItem value="manager">مدير إدارة راحة العملاء</SelectItem>
                    <SelectItem value="customer_service">موظف إدارة راحة العملاء</SelectItem>
                    <SelectItem value="maintenance">موظف صيانة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm mb-1">رمز الدخول</label>
                <Input placeholder="أدخل رمز الدخول" type="password" />
              </div>
            </div>
            <Button className="mt-4">إضافة المستخدم</Button>
          </div>
        </Card>

        <Card className="bg-card/50 p-6">
          <h2 className="text-xl font-bold mb-6">إعدادات أخرى</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">إعدادات الإشعارات</h3>
              <p className="text-sm text-muted-foreground">
                تحكم في إعدادات الإشعارات واختر متى وكيف تريد استلامها
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">إعدادات النظام</h3>
              <p className="text-sm text-muted-foreground">
                تخصيص إعدادات النظام والواجهة
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          </DialogHeader>
          <UserForm 
            onSubmit={handleAddUser} 
            onCancel={() => setIsAddUserDialogOpen(false)} 
            btnText="إضافة المستخدم" 
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm 
              initialData={selectedUser}
              onSubmit={handleEditUser}
              onCancel={() => setIsEditUserDialogOpen(false)}
              btnText="حفظ التعديلات"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  btnText: string;
}

const UserForm = ({ initialData, onSubmit, onCancel, btnText }: UserFormProps) => {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    username: initialData?.username || '',
    role: initialData?.role || 'customer_service',
    password: '',
    createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, role: value as 'admin' | 'manager' | 'customer_service' | 'maintenance' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          اسم المستخدم
        </label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="أدخل اسم المستخدم"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="role" className="text-sm font-medium">
          الصلاحية
        </label>
        <Select
          value={formData.role}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر الصلاحية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">مدير النظام</SelectItem>
            <SelectItem value="manager">مدير إدارة راحة العملاء</SelectItem>
            <SelectItem value="customer_service">موظف إدارة راحة العملاء</SelectItem>
            <SelectItem value="maintenance">موظف صيانة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          رمز الدخول {initialData ? '(اتركه فارغاً إذا لم ترغب في تغييره)' : ''}
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={initialData ? '••••••••' : 'أدخل رمز الدخول'}
          required={!initialData}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit">
          {btnText}
        </Button>
      </div>
    </form>
  );
};

export default Settings;
