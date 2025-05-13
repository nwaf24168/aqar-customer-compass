
import { supabase } from '@/integrations/supabase/client';
import { CustomerSatisfaction } from '@/types';

export interface SatisfactionCategory {
  title: string;
  metrics: { id: string; label: string; value: number; }[];
}

export interface SatisfactionData {
  categories: SatisfactionCategory[];
  comments: string;
}

export const fetchSatisfactionData = async (period: 'weekly' | 'yearly'): Promise<SatisfactionData> => {
  try {
    const { data, error } = await supabase
      .from('customer_satisfaction')
      .select('*')
      .eq('period', period)
      .order('date', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error(`Error fetching ${period} satisfaction data:`, error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      // إذا لم نجد بيانات، نحاول استردادها من التخزين المحلي
      const localData = fetchFromLocalStorage(period);
      
      // محاولة حفظ البيانات المحلية في قاعدة البيانات للمرة القادمة
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (userId) {
        await saveSatisfactionData(localData, period);
      }
      
      return localData;
    }
    
    // تحويل البيانات إلى التنسيق المطلوب
    const satisfactionData = data[0];
    
    const categories: SatisfactionCategory[] = [
      {
        title: 'الحل من أول مرة',
        metrics: [
          { id: 'firstTimeVeryGood', label: 'راضي جداً', value: satisfactionData.first_time_resolution_very_good },
          { id: 'firstTimeGood', label: 'راضي', value: satisfactionData.first_time_resolution_good },
          { id: 'firstTimeNeutral', label: 'محايد', value: satisfactionData.first_time_resolution_neutral },
          { id: 'firstTimeBad', label: 'غير راضي', value: satisfactionData.first_time_resolution_bad },
          { id: 'firstTimeVeryBad', label: 'غير راضي جداً', value: satisfactionData.first_time_resolution_very_bad }
        ]
      },
      {
        title: 'وقت الإغلاق',
        metrics: [
          { id: 'closingTimeVeryGood', label: 'راضي جداً', value: satisfactionData.closing_time_very_good },
          { id: 'closingTimeGood', label: 'راضي', value: satisfactionData.closing_time_good },
          { id: 'closingTimeNeutral', label: 'محايد', value: satisfactionData.closing_time_neutral },
          { id: 'closingTimeBad', label: 'غير راضي', value: satisfactionData.closing_time_bad },
          { id: 'closingTimeVeryBad', label: 'غير راضي جداً', value: satisfactionData.closing_time_very_bad }
        ]
      },
      {
        title: 'جودة الخدمة',
        metrics: [
          { id: 'serviceQualityVeryGood', label: 'راضي جداً', value: satisfactionData.service_quality_very_good },
          { id: 'serviceQualityGood', label: 'راضي', value: satisfactionData.service_quality_good },
          { id: 'serviceQualityNeutral', label: 'محايد', value: satisfactionData.service_quality_neutral },
          { id: 'serviceQualityBad', label: 'غير راضي', value: satisfactionData.service_quality_bad },
          { id: 'serviceQualityVeryBad', label: 'غير راضي جداً', value: satisfactionData.service_quality_very_bad }
        ]
      }
    ];
    
    return {
      categories,
      comments: satisfactionData.comments || ''
    };
  } catch (error) {
    console.error(`Error in fetchSatisfactionData (${period}):`, error);
    return fetchFromLocalStorage(period);
  }
};

const fetchFromLocalStorage = (period: 'weekly' | 'yearly'): SatisfactionData => {
  const storageKey = `satisfactionData_${period}`;
  const savedData = localStorage.getItem(storageKey);
  const commentsKey = `satisfactionComments_${period}`;
  const savedComments = localStorage.getItem(commentsKey) || '';
  
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    return {
      categories: parsedData.categories || getInitialCategories(period),
      comments: parsedData.comments || savedComments
    };
  }
  
  return {
    categories: getInitialCategories(period),
    comments: savedComments
  };
};

const getInitialCategories = (period: 'weekly' | 'yearly'): SatisfactionCategory[] => {
  if (period === 'weekly') {
    return [
      {
        title: 'الحل من أول مرة',
        metrics: [
          { id: 'firstTimeVeryGood', label: 'راضي جداً', value: 35 },
          { id: 'firstTimeGood', label: 'راضي', value: 38 },
          { id: 'firstTimeNeutral', label: 'محايد', value: 18 },
          { id: 'firstTimeBad', label: 'غير راضي', value: 6 },
          { id: 'firstTimeVeryBad', label: 'غير راضي جداً', value: 3 }
        ]
      },
      {
        title: 'وقت الإغلاق',
        metrics: [
          { id: 'closingTimeVeryGood', label: 'راضي جداً', value: 25 },
          { id: 'closingTimeGood', label: 'راضي', value: 45 },
          { id: 'closingTimeNeutral', label: 'محايد', value: 20 },
          { id: 'closingTimeBad', label: 'غير راضي', value: 7 },
          { id: 'closingTimeVeryBad', label: 'غير راضي جداً', value: 3 }
        ]
      },
      {
        title: 'جودة الخدمة',
        metrics: [
          { id: 'serviceQualityVeryGood', label: 'راضي جداً', value: 30 },
          { id: 'serviceQualityGood', label: 'راضي', value: 40 },
          { id: 'serviceQualityNeutral', label: 'محايد', value: 20 },
          { id: 'serviceQualityBad', label: 'غير راضي', value: 8 },
          { id: 'serviceQualityVeryBad', label: 'غير راضي جداً', value: 2 }
        ]
      }
    ];
  } else {
    return [
      {
        title: 'الحل من أول مرة',
        metrics: [
          { id: 'firstTimeVeryGood', label: 'راضي جداً', value: 420 },
          { id: 'firstTimeGood', label: 'راضي', value: 500 },
          { id: 'firstTimeNeutral', label: 'محايد', value: 220 },
          { id: 'firstTimeBad', label: 'غير راضي', value: 80 },
          { id: 'firstTimeVeryBad', label: 'غير راضي جداً', value: 30 }
        ]
      },
      {
        title: 'وقت الإغلاق',
        metrics: [
          { id: 'closingTimeVeryGood', label: 'راضي جداً', value: 320 },
          { id: 'closingTimeGood', label: 'راضي', value: 550 },
          { id: 'closingTimeNeutral', label: 'محايد', value: 240 },
          { id: 'closingTimeBad', label: 'غير راضي', value: 90 },
          { id: 'closingTimeVeryBad', label: 'غير راضي جداً', value: 40 }
        ]
      },
      {
        title: 'جودة الخدمة',
        metrics: [
          { id: 'serviceQualityVeryGood', label: 'راضي جداً', value: 380 },
          { id: 'serviceQualityGood', label: 'راضي', value: 520 },
          { id: 'serviceQualityNeutral', label: 'محايد', value: 250 },
          { id: 'serviceQualityBad', label: 'غير راضي', value: 100 },
          { id: 'serviceQualityVeryBad', label: 'غير راضي جداً', value: 35 }
        ]
      }
    ];
  }
};

export const saveSatisfactionData = async (data: SatisfactionData, period: 'weekly' | 'yearly'): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      console.error('No authenticated user found');
      return false;
    }
    
    // استخراج بيانات كل فئة
    const getCategory = (title: string) => data.categories.find(c => c.title === title);
    const getMetricValue = (category: SatisfactionCategory | undefined, id: string) => {
      if (!category) return 0;
      const metric = category.metrics.find(m => m.id === id);
      return metric ? metric.value : 0;
    };
    
    const serviceQualityCategory = getCategory('جودة الخدمة');
    const closingTimeCategory = getCategory('وقت الإغلاق');
    const firstTimeCategory = getCategory('الحل من أول مرة');
    
    // Check if there's a record for today
    const currentDate = new Date().toISOString().split('T')[0];
    const { data: existingData, error: fetchError } = await supabase
      .from('customer_satisfaction')
      .select('id')
      .eq('period', period)
      .eq('date', currentDate)
      .limit(1);
      
    if (fetchError) {
      console.error('Error checking for existing satisfaction data:', fetchError);
      throw fetchError;
    }
    
    let result;
    
    if (existingData && existingData.length > 0) {
      // Update existing record
      result = await supabase
        .from('customer_satisfaction')
        .update({
          // جودة الخدمة
          service_quality_very_good: getMetricValue(serviceQualityCategory, 'serviceQualityVeryGood'),
          service_quality_good: getMetricValue(serviceQualityCategory, 'serviceQualityGood'),
          service_quality_neutral: getMetricValue(serviceQualityCategory, 'serviceQualityNeutral'),
          service_quality_bad: getMetricValue(serviceQualityCategory, 'serviceQualityBad'),
          service_quality_very_bad: getMetricValue(serviceQualityCategory, 'serviceQualityVeryBad'),
          
          // وقت الإغلاق
          closing_time_very_good: getMetricValue(closingTimeCategory, 'closingTimeVeryGood'),
          closing_time_good: getMetricValue(closingTimeCategory, 'closingTimeGood'),
          closing_time_neutral: getMetricValue(closingTimeCategory, 'closingTimeNeutral'),
          closing_time_bad: getMetricValue(closingTimeCategory, 'closingTimeBad'),
          closing_time_very_bad: getMetricValue(closingTimeCategory, 'closingTimeVeryBad'),
          
          // الحل من أول مرة
          first_time_resolution_very_good: getMetricValue(firstTimeCategory, 'firstTimeVeryGood'),
          first_time_resolution_good: getMetricValue(firstTimeCategory, 'firstTimeGood'),
          first_time_resolution_neutral: getMetricValue(firstTimeCategory, 'firstTimeNeutral'),
          first_time_resolution_bad: getMetricValue(firstTimeCategory, 'firstTimeBad'),
          first_time_resolution_very_bad: getMetricValue(firstTimeCategory, 'firstTimeVeryBad'),
          
          comments: data.comments || ''
        })
        .eq('id', existingData[0].id);
    } else {
      // Insert new record
      result = await supabase.from('customer_satisfaction').insert({
        period,
        date: currentDate,
        
        // جودة الخدمة
        service_quality_very_good: getMetricValue(serviceQualityCategory, 'serviceQualityVeryGood'),
        service_quality_good: getMetricValue(serviceQualityCategory, 'serviceQualityGood'),
        service_quality_neutral: getMetricValue(serviceQualityCategory, 'serviceQualityNeutral'),
        service_quality_bad: getMetricValue(serviceQualityCategory, 'serviceQualityBad'),
        service_quality_very_bad: getMetricValue(serviceQualityCategory, 'serviceQualityVeryBad'),
        
        // وقت الإغلاق
        closing_time_very_good: getMetricValue(closingTimeCategory, 'closingTimeVeryGood'),
        closing_time_good: getMetricValue(closingTimeCategory, 'closingTimeGood'),
        closing_time_neutral: getMetricValue(closingTimeCategory, 'closingTimeNeutral'),
        closing_time_bad: getMetricValue(closingTimeCategory, 'closingTimeBad'),
        closing_time_very_bad: getMetricValue(closingTimeCategory, 'closingTimeVeryBad'),
        
        // الحل من أول مرة
        first_time_resolution_very_good: getMetricValue(firstTimeCategory, 'firstTimeVeryGood'),
        first_time_resolution_good: getMetricValue(firstTimeCategory, 'firstTimeGood'),
        first_time_resolution_neutral: getMetricValue(firstTimeCategory, 'firstTimeNeutral'),
        first_time_resolution_bad: getMetricValue(firstTimeCategory, 'firstTimeBad'),
        first_time_resolution_very_bad: getMetricValue(firstTimeCategory, 'firstTimeVeryBad'),
        
        comments: data.comments || '',
        created_by: userId
      });
    }
    
    if (result.error) {
      console.error('Error saving satisfaction data:', result.error);
      throw result.error;
    }
    
    // تحديث بيانات التحليلات أيضًا بمتوسط رضا العملاء
    await updateAnalyticsWithSatisfactionData(data.categories, userId, period);
    
    // حفظ البيانات أيضًا في التخزين المحلي كاحتياط
    const storageKey = `satisfactionData_${period}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    const commentsKey = `satisfactionComments_${period}`;
    localStorage.setItem(commentsKey, data.comments || '');
    
    return true;
  } catch (error) {
    console.error('Error in saveSatisfactionData:', error);
    return false;
  }
};

// تحديث بيانات التحليلات مع بيانات رضا العملاء
const updateAnalyticsWithSatisfactionData = async (
  categories: SatisfactionCategory[],
  userId: string, 
  period: 'weekly' | 'yearly'
): Promise<void> => {
  try {
    // حساب متوسط رضا العملاء لكل فئة
    const calculateAverage = (categoryTitle: string): number => {
      const category = categories.find(c => c.title === categoryTitle);
      if (!category) return 0;
      
      const totalResponses = category.metrics.reduce((sum, m) => sum + m.value, 0);
      if (totalResponses === 0) return 0;
      
      // حساب المتوسط المرجح (5 للراضي جداً، 4 للراضي، وهكذا)
      const weightedSum = 
        5 * category.metrics.find(m => m.id.endsWith('VeryGood'))?.value +
        4 * category.metrics.find(m => m.id.endsWith('Good'))?.value +
        3 * category.metrics.find(m => m.id.endsWith('Neutral'))?.value +
        2 * category.metrics.find(m => m.id.endsWith('Bad'))?.value +
        1 * category.metrics.find(m => m.id.endsWith('VeryBad'))?.value;
      
      return (weightedSum / (totalResponses * 5)) * 100; // نسبة مئوية من 0 إلى 100
    };
    
    const serviceQualityAvg = calculateAverage('جودة الخدمة');
    const closingTimeAvg = calculateAverage('وقت الإغلاق');
    const firstTimeResolutionAvg = calculateAverage('الحل من أول مرة');
    
    // البحث عن أحدث سجل تحليلات للتحديث
    const { data, error: fetchError } = await supabase
      .from('analytics_data')
      .select('id')
      .eq('period', period)
      .order('date', { ascending: false })
      .limit(1);
    
    if (fetchError) {
      console.error('Error fetching analytics data for update:', fetchError);
      throw fetchError;
    }
    
    if (data && data.length > 0) {
      // تحديث سجل موجود
      const { error: updateError } = await supabase
        .from('analytics_data')
        .update({
          customer_satisfaction_service_quality: serviceQualityAvg,
          customer_satisfaction_closing_time: closingTimeAvg,
          customer_satisfaction_first_time_resolution: firstTimeResolutionAvg
        })
        .eq('id', data[0].id);
      
      if (updateError) {
        console.error('Error updating analytics with satisfaction data:', updateError);
        throw updateError;
      }
    } else {
      // إنشاء سجل جديد إذا لم يكن هناك سجل
      const { error: insertError } = await supabase.from('analytics_data').insert({
        period,
        date: new Date().toISOString().split('T')[0],
        customer_satisfaction_service_quality: serviceQualityAvg,
        customer_satisfaction_closing_time: closingTimeAvg,
        customer_satisfaction_first_time_resolution: firstTimeResolutionAvg,
        call_complaints: 0,
        call_contact_requests: 0,
        call_maintenance_requests: 0,
        call_inquiries: 0,
        call_office_appointments: 0,
        call_project_appointments: 0,
        call_guest_appointments: 0,
        nps_new_clients: 0,
        nps_after_year: 0,
        nps_old_clients: 0,
        created_by: userId
      });
      
      if (insertError) {
        console.error('Error inserting analytics with satisfaction data:', insertError);
        throw insertError;
      }
    }
  } catch (error) {
    console.error('Error in updateAnalyticsWithSatisfactionData:', error);
  }
};
