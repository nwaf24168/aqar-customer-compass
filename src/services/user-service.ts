
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase.from('profiles').select('*');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    // تحويل البيانات إلى نوع User
    return data.map(item => ({
      id: item.id,
      username: item.username,
      role: item.role as User['role'],
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    return [];
  }
};

export const addUser = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<User | null> => {
  try {
    // إنشاء المستخدم في نظام المصادقة
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: `${userData.username}@example.com`,
      password: userData.password,
      email_confirm: true
    });
    
    if (authError) {
      console.error('Error creating user in auth:', authError);
      throw authError;
    }
    
    // تحديث بيانات المستخدم في جدول الملفات الشخصية
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: userData.role })
      .eq('id', authData.user.id)
      .select();
    
    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
    
    return {
      id: authData.user.id,
      username: userData.username,
      role: userData.role,
      createdAt: new Date().toISOString().split('T')[0]
    };
  } catch (error) {
    console.error('Error in addUser:', error);
    return null;
  }
};

export const updateUser = async (userData: User): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        username: userData.username,
        role: userData.role
      })
      .eq('id', userData.id)
      .select();
    
    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }
    
    return data[0] ? {
      id: data[0].id,
      username: data[0].username,
      role: data[0].role as User['role'],
      createdAt: data[0].created_at
    } : null;
  } catch (error) {
    console.error('Error in updateUser:', error);
    return null;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // First delete from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error('Error deleting user from auth:', authError);
      throw authError;
    }
    
    // The profiles entry should be deleted automatically via cascade
    return true;
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return false;
  }
};
