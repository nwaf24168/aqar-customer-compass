
import { supabase } from '@/integrations/supabase/client';
import { Metric } from '@/types';

export const fetchMetrics = async (period: 'weekly' | 'yearly'): Promise<Metric[]> => {
  try {
    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .eq('period', period);
    
    if (error) {
      console.error(`Error fetching ${period} metrics:`, error);
      throw error;
    }
    
    // تحويل البيانات إلى نوع Metric
    return data.map(item => ({
      id: item.id,
      period: item.period as 'weekly' | 'yearly',
      date: item.date,
      category: item.category,
      name: item.name,
      value: item.value,
      goal: item.goal,
      change: item.change,
      achieved: item.achieved,
      createdBy: item.created_by,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error(`Error in fetchMetrics (${period}):`, error);
    
    // إذا فشل الجلب، حاول استرداد البيانات من التخزين المحلي كاحتياط
    const storageKey = `performanceMetrics_${period}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const metrics = JSON.parse(savedData);
      return metrics.map((m: any, index: number) => ({
        id: index.toString(),
        period: period as 'weekly' | 'yearly',
        date: new Date().toISOString().split('T')[0],
        category: 'performance',
        name: m.id,
        value: m.value,
        goal: m.goal,
        change: 0, // لا نملك بيانات التغيير من localStorage
        achieved: m.achieved,
        createdBy: 'system',
        createdAt: new Date().toISOString()
      }));
    }
    return [];
  }
};

export const saveMetrics = async (metrics: Omit<Metric, 'id' | 'createdAt' | 'createdBy'>[]): Promise<boolean> => {
  try {
    // إذا كانت البيانات فارغة، لا نفعل شيئًا
    if (!metrics || metrics.length === 0) return false;
    
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      console.error('No authenticated user found');
      return false;
    }
    
    // إنشاء مصفوفة من عمليات الإدخال
    const insertPromises = metrics.map(metric => 
      supabase.from('metrics').insert({
        period: metric.period,
        date: metric.date || new Date().toISOString().split('T')[0],
        category: metric.category,
        name: metric.name,
        value: metric.value,
        goal: metric.goal,
        change: metric.change || 0,
        achieved: metric.achieved,
        created_by: userId
      })
    );
    
    await Promise.all(insertPromises);
    
    // حفظ البيانات في التخزين المحلي كاحتياط
    const storageKey = `performanceMetrics_${metrics[0].period}`;
    localStorage.setItem(storageKey, JSON.stringify(metrics));
    
    return true;
  } catch (error) {
    console.error('Error saving metrics:', error);
    return false;
  }
};
