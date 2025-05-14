
import { supabase } from '@/integrations/supabase/client';
import { Metric } from '@/types';

export const fetchMetrics = async (period: 'weekly' | 'yearly'): Promise<Metric[]> => {
  try {
    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .eq('period', period)
      .order('date', { ascending: false })
      .limit(12); // Get the most recent metrics
    
    if (error) {
      console.error(`Error fetching ${period} metrics:`, error);
      throw error;
    }
    
    // Transform database data to application Metric type
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
    
    // Fallback to localStorage as backup
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
        change: 0, // No change data from localStorage
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
    // If data is empty, do nothing
    if (!metrics || metrics.length === 0) return false;
    
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      console.error('No authenticated user found');
      
      // Save to localStorage as backup
      const storageKey = `performanceMetrics_${metrics[0].period}`;
      localStorage.setItem(storageKey, JSON.stringify(metrics));
      
      return false;
    }
    
    // Check if metrics for this period and date already exist
    const period = metrics[0].period;
    const date = metrics[0].date || new Date().toISOString().split('T')[0];
    
    const { data: existingMetrics, error: fetchError } = await supabase
      .from('metrics')
      .select('id')
      .eq('period', period)
      .eq('date', date)
      .eq('category', 'performance');
      
    if (fetchError) {
      console.error('Error checking for existing metrics:', fetchError);
      throw fetchError;
    }
    
    // If metrics already exist for this period and date, delete them first
    if (existingMetrics && existingMetrics.length > 0) {
      const { error: deleteError } = await supabase
        .from('metrics')
        .delete()
        .in('id', existingMetrics.map(m => m.id));
        
      if (deleteError) {
        console.error('Error deleting existing metrics:', deleteError);
        throw deleteError;
      }
      
      console.log(`Deleted ${existingMetrics.length} existing metrics for ${period} - ${date}`);
    }
    
    // Prepare data for insertion
    const metricsToInsert = metrics.map(metric => ({
      period: metric.period,
      date: metric.date || date,
      category: metric.category,
      name: metric.name,
      value: metric.value,
      goal: metric.goal,
      change: metric.change || 0,
      achieved: metric.achieved,
      created_by: userId
    }));
    
    console.log(`Inserting ${metricsToInsert.length} metrics for ${period} - ${date}`);
    
    // Insert new metrics
    const { error: insertError } = await supabase
      .from('metrics')
      .insert(metricsToInsert);
      
    if (insertError) {
      console.error('Error inserting metrics:', insertError);
      throw insertError;
    }
    
    // Save in localStorage as backup
    const storageKey = `performanceMetrics_${metrics[0].period}`;
    localStorage.setItem(storageKey, JSON.stringify(metrics));
    
    console.log(`Successfully saved metrics to Supabase`);
    return true;
  } catch (error) {
    console.error('Error saving metrics:', error);
    
    // Try to save in localStorage as fallback
    if (metrics && metrics.length > 0) {
      const storageKey = `performanceMetrics_${metrics[0].period}`;
      localStorage.setItem(storageKey, JSON.stringify(metrics));
    }
    
    return false;
  }
};
