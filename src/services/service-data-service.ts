
import { supabase } from '@/integrations/supabase/client';

export interface ServiceCategory {
  title: string;
  metrics: { id: string; label: string; value: number; }[];
}

// واجهة لبيانات المكالمات لحفظها في قاعدة البيانات
export interface CallData {
  period: 'weekly' | 'yearly';
  date: string;
  complaints: number;
  contactRequests: number;
  maintenanceRequests: number;
  inquiries: number;
  officeAppointments: number;
  projectAppointments: number;
  guestAppointments: number;
  created_by: string;
}

export const fetchServiceData = async (period: 'weekly' | 'yearly'): Promise<ServiceCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('period', period)
      .order('date', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error(`Error fetching ${period} service data:`, error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      // إذا لم نجد بيانات، نحاول استردادها من التخزين المحلي
      return fetchFromLocalStorage(period);
    }
    
    // تحويل البيانات إلى التنسيق المطلوب
    const callsData = data[0];
    
    const categories: ServiceCategory[] = [
      {
        title: 'المكالمات',
        metrics: [
          { id: 'complaints', label: 'شكاوى', value: callsData.call_complaints },
          { id: 'contactRequests', label: 'طلبات تواصل', value: callsData.call_contact_requests },
          { id: 'maintenanceRequests', label: 'طلبات صيانة', value: callsData.call_maintenance_requests },
          { id: 'inquiries', label: 'استفسارات', value: callsData.call_inquiries },
          { id: 'officeAppointments', label: 'مهتمين مكاتب', value: callsData.call_office_appointments },
          { id: 'projectAppointments', label: 'مهتمين مشاريع', value: callsData.call_project_appointments },
          { id: 'interestedClients', label: 'عملاء مهتمين', value: callsData.call_guest_appointments }
        ]
      },
      // يمكن إضافة فئات أخرى هنا
      {
        title: 'الاستفسارات',
        metrics: [
          { id: 'generalInquiries', label: 'استفسارات عامة', value: 20 },
          { id: 'documentRequests', label: 'طلب أوراق', value: 10 },
          { id: 'suspectInquiries', label: 'استفسارات مشكوك', value: 8 },
          { id: 'apartmentRentals', label: 'إيجارات شقق', value: 12 },
          { id: 'availableProjects', label: 'مشاريع متاحة', value: 8 }
        ]
      },
      {
        title: 'طلبات الصيانة',
        metrics: [
          { id: 'cancelled', label: 'ملغية', value: 5 },
          { id: 'resolved', label: 'منجزة', value: 45 },
          { id: 'inProgress', label: 'قيد التنفيذ', value: 15 }
        ]
      }
    ];
    
    return categories;
  } catch (error) {
    console.error(`Error in fetchServiceData (${period}):`, error);
    return fetchFromLocalStorage(period);
  }
};

const fetchFromLocalStorage = (period: 'weekly' | 'yearly'): ServiceCategory[] => {
  const storageKey = `serviceData_${period}`;
  const savedData = localStorage.getItem(storageKey);
  if (savedData) {
    return JSON.parse(savedData);
  }
  
  // بيانات افتراضية إذا لم نجد شيئًا في التخزين المحلي
  return period === 'weekly' ? getInitialWeeklyCategories() : getInitialYearlyCategories();
};

const getInitialWeeklyCategories = (): ServiceCategory[] => [
  {
    title: 'المكالمات',
    metrics: [
      { id: 'complaints', label: 'شكاوى', value: 28 },
      { id: 'contactRequests', label: 'طلبات تواصل', value: 42 },
      { id: 'maintenanceRequests', label: 'طلبات صيانة', value: 65 },
      { id: 'inquiries', label: 'استفسارات', value: 58 },
      { id: 'officeAppointments', label: 'مهتمين مكاتب', value: 34 },
      { id: 'projectAppointments', label: 'مهتمين مشاريع', value: 38 },
      { id: 'interestedClients', label: 'عملاء مهتمين', value: 42 }
    ]
  },
  {
    title: 'الاستفسارات',
    metrics: [
      { id: 'generalInquiries', label: 'استفسارات عامة', value: 20 },
      { id: 'documentRequests', label: 'طلب أوراق', value: 10 },
      { id: 'suspectInquiries', label: 'استفسارات مشكوك', value: 8 },
      { id: 'apartmentRentals', label: 'إيجارات شقق', value: 12 },
      { id: 'availableProjects', label: 'مشاريع متاحة', value: 8 }
    ]
  },
  {
    title: 'طلبات الصيانة',
    metrics: [
      { id: 'cancelled', label: 'ملغية', value: 5 },
      { id: 'resolved', label: 'منجزة', value: 45 },
      { id: 'inProgress', label: 'قيد التنفيذ', value: 15 }
    ]
  }
];

const getInitialYearlyCategories = (): ServiceCategory[] => [
  {
    title: 'المكالمات',
    metrics: [
      { id: 'complaints', label: 'شكاوى', value: 350 },
      { id: 'contactRequests', label: 'طلبات تواصل', value: 520 },
      { id: 'maintenanceRequests', label: 'طلبات صيانة', value: 780 },
      { id: 'inquiries', label: 'استفسارات', value: 650 },
      { id: 'officeAppointments', label: 'مهتمين مكاتب', value: 420 },
      { id: 'projectAppointments', label: 'مهتمين مشاريع', value: 480 },
      { id: 'interestedClients', label: 'عملاء مهتمين', value: 520 }
    ]
  },
  {
    title: 'الاستفسارات',
    metrics: [
      { id: 'generalInquiries', label: 'استفسارات عامة', value: 240 },
      { id: 'documentRequests', label: 'طلب أوراق', value: 120 },
      { id: 'suspectInquiries', label: 'استفسارات مشكوك', value: 90 },
      { id: 'apartmentRentals', label: 'إيجارات شقق', value: 150 },
      { id: 'availableProjects', label: 'مشاريع متاحة', value: 95 }
    ]
  },
  {
    title: 'طلبات الصيانة',
    metrics: [
      { id: 'cancelled', label: 'ملغية', value: 60 },
      { id: 'resolved', label: 'منجزة', value: 550 },
      { id: 'inProgress', label: 'قيد التنفيذ', value: 170 }
    ]
  }
];

export const saveServiceData = async (categories: ServiceCategory[], period: 'weekly' | 'yearly'): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      console.error('No authenticated user found');
      return false;
    }
    
    // استخراج بيانات المكالمات من الفئات
    const callsCategory = categories.find(c => c.title === 'المكالمات');
    if (!callsCategory) {
      console.error('No calls category found');
      return false;
    }
    
    const findMetricValue = (id: string): number => {
      const metric = callsCategory.metrics.find(m => m.id === id);
      return metric ? metric.value : 0;
    };
    
    const callData: CallData = {
      period,
      date: new Date().toISOString().split('T')[0],
      complaints: findMetricValue('complaints'),
      contactRequests: findMetricValue('contactRequests'),
      maintenanceRequests: findMetricValue('maintenanceRequests'),
      inquiries: findMetricValue('inquiries'),
      officeAppointments: findMetricValue('officeAppointments'),
      projectAppointments: findMetricValue('projectAppointments'),
      guestAppointments: findMetricValue('interestedClients'),
      created_by: userId
    };
    
    const { error } = await supabase.from('analytics_data').insert({
      period: callData.period,
      date: callData.date,
      call_complaints: callData.complaints,
      call_contact_requests: callData.contactRequests,
      call_maintenance_requests: callData.maintenanceRequests,
      call_inquiries: callData.inquiries,
      call_office_appointments: callData.officeAppointments,
      call_project_appointments: callData.projectAppointments,
      call_guest_appointments: callData.guestAppointments,
      customer_satisfaction_service_quality: 0, // سيتم تحديثها في خدمة رضا العملاء
      customer_satisfaction_closing_time: 0,
      customer_satisfaction_first_time_resolution: 0,
      nps_new_clients: 0,
      nps_after_year: 0,
      nps_old_clients: 0,
      created_by: userId
    });
    
    if (error) {
      console.error('Error saving service data:', error);
      throw error;
    }
    
    // حفظ البيانات أيضًا في التخزين المحلي كاحتياط
    const storageKey = `serviceData_${period}`;
    localStorage.setItem(storageKey, JSON.stringify(categories));
    
    return true;
  } catch (error) {
    console.error('Error in saveServiceData:', error);
    return false;
  }
};
