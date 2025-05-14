
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Metric {
  id: string;
  label: string;
  goal: number;
  value: number;
  achieved: boolean;
}

interface PerformanceMetricsFormProps {
  period: 'weekly' | 'yearly';
  isUserAuthenticated: boolean;
  onSubmit: (data: Metric[]) => void;
}

const PerformanceMetricsForm = ({ period, isUserAuthenticated, onSubmit }: PerformanceMetricsFormProps) => {
  // Define initial metrics
  const initialWeeklyMetrics = [
    { id: 'deliveryQuality', label: 'جودة التسليم', goal: 100, value: 98, achieved: true },
    { id: 'oldClientReferral', label: 'نسبة الترشيح للعملاء القدامى', goal: 30, value: 30, achieved: true },
    { id: 'afterYearReferral', label: 'نسبة الترشيح بعد السنة', goal: 65, value: 67, achieved: true },
    { id: 'newClientReferral', label: 'نسبة الترشيح للعملاء الجدد', goal: 65, value: 65, achieved: true },
    { id: 'maintenanceQuality', label: 'جودة الصيانة', goal: 100, value: 96, achieved: true },
    { id: 'responseTime', label: 'عدد الثواني للرد', goal: 3, value: 2.8, achieved: true },
    { id: 'csat', label: 'راحة العميل (CSAT)', goal: 70, value: 74, achieved: true },
    { id: 'callResponseRate', label: 'معدل الرد على المكالمات', goal: 80, value: 18, achieved: false },
    { id: 'maintenanceClosureSpeed', label: 'سرعة إغلاق طلبات الصيانة', goal: 3, value: 2.5, achieved: true },
    { id: 'reopenRequests', label: 'عدد إعادة فتح طلب', goal: 0, value: 0, achieved: true },
    { id: 'facilityManagementQuality', label: 'جودة إدارة المرافق', goal: 80, value: 80, achieved: true },
    { id: 'conversionRate', label: 'معدل التحول', goal: 2, value: 2, achieved: true },
  ];

  const initialYearlyMetrics = [
    { id: 'deliveryQuality', label: 'جودة التسليم', goal: 100, value: 95, achieved: true },
    { id: 'oldClientReferral', label: 'نسبة الترشيح للعملاء القدامى', goal: 35, value: 32, achieved: true },
    { id: 'afterYearReferral', label: 'نسبة الترشيح بعد السنة', goal: 70, value: 65, achieved: true },
    { id: 'newClientReferral', label: 'نسبة الترشيح للعملاء الجدد', goal: 70, value: 68, achieved: true },
    { id: 'maintenanceQuality', label: 'جودة الصيانة', goal: 100, value: 90, achieved: true },
    { id: 'responseTime', label: 'عدد الثواني للرد', goal: 3, value: 3, achieved: true },
    { id: 'csat', label: 'راحة العميل (CSAT)', goal: 75, value: 76, achieved: true },
    { id: 'callResponseRate', label: 'معدل الرد على المكالمات', goal: 85, value: 75, achieved: false },
    { id: 'maintenanceClosureSpeed', label: 'سرعة إغلاق طلبات الصيانة', goal: 2.8, value: 2.5, achieved: true },
    { id: 'reopenRequests', label: 'عدد إعادة فتح طلب', goal: 0, value: 1, achieved: false },
    { id: 'facilityManagementQuality', label: 'جودة إدارة المرافق', goal: 85, value: 83, achieved: true },
    { id: 'conversionRate', label: 'معدل التحول', goal: 2.5, value: 2.3, achieved: true },
  ];
  
  // Load saved data from localStorage or fetch from API based on period
  const [metrics, setMetrics] = useState<Metric[]>(() => {
    const storageKey = `performanceMetrics_${period}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return period === 'weekly' ? initialWeeklyMetrics : initialYearlyMetrics;
  });
  
  // Update metrics when period changes
  useEffect(() => {
    const storageKey = `performanceMetrics_${period}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      setMetrics(JSON.parse(savedData));
    } else {
      setMetrics(period === 'weekly' ? initialWeeklyMetrics : initialYearlyMetrics);
    }
  }, [period]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage first as backup
    const storageKey = `performanceMetrics_${period}`;
    localStorage.setItem(storageKey, JSON.stringify(metrics));
    onSubmit(metrics);
  };
  
  const updateMetricValue = (id: string, value: number) => {
    setMetrics(prevMetrics => 
      prevMetrics.map(metric => {
        if (metric.id === id) {
          const achieved = value >= metric.goal;
          return { ...metric, value, achieved };
        }
        return metric;
      })
    );
  };

  // Function to determine achievement status and color
  const getAchievementStatus = (value: number, goal: number) => {
    if (value >= goal) {
      return { 
        text: 'تم تحقيق الهدف', 
        className: 'bg-emerald-500/20 text-emerald-500'
      };
    }
    
    const ratio = (value / goal) * 100;
    if (ratio >= 90) {
      return { 
        text: 'قريب من الهدف', 
        className: 'bg-amber-500/20 text-amber-500'
      };
    }
    
    return { 
      text: 'لم يتم تحقيق الهدف', 
      className: 'bg-red-500/20 text-red-500'
    };
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">
        مؤشرات الأداء الرئيسية - {period === 'weekly' ? 'أسبوعي' : 'سنوي'}
      </h2>
      
      {!isUserAuthenticated && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4">
          تنبيه: أنت غير مسجل الدخول. سيتم حفظ البيانات محلياً فقط وقد تفقد عند مسح ذاكرة المتصفح.
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const status = getAchievementStatus(metric.value, metric.goal);
          
          return (
            <Card key={metric.id} className="p-6 bg-card/50">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label htmlFor={metric.id} className="font-medium">{metric.label}</label>
                  <span className="text-sm">الهدف: {metric.goal}</span>
                </div>
                
                <Input 
                  id={metric.id}
                  type="number"
                  value={metric.value}
                  onChange={(e) => updateMetricValue(metric.id, parseFloat(e.target.value))}
                  step="0.1"
                  dir="ltr"
                  className="text-left"
                />
                
                <div className={`py-1 px-3 text-center text-sm rounded ${status.className}`}>
                  {status.text}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" className="w-32">تسجيل</Button>
      </div>
    </form>
  );
};

export default PerformanceMetricsForm;
