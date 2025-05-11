
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const DataEntry = () => {
  const [period, setPeriod] = useState<'weekly' | 'yearly'>('weekly');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">إدخال البيانات</h1>
        
        <div className="flex items-center gap-2">
          <Button
            variant={period === 'yearly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('yearly')}
          >
            سنوي
          </Button>
          <Button
            variant={period === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('weekly')}
          >
            أسبوعي
          </Button>
        </div>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="performance">مؤشرات الأداء</TabsTrigger>
          <TabsTrigger value="service">خدمة العملاء</TabsTrigger>
          <TabsTrigger value="satisfaction">رضا العملاء</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-6">
          <PerformanceMetricsForm 
            period={period}
            onSubmit={(data) => {
              // Save to localStorage with period key
              const storageKey = `performanceMetrics_${period}`;
              localStorage.setItem(storageKey, JSON.stringify(data));
              console.log(`Saving ${period} performance metrics:`, data);
              toast({
                title: "تم الحفظ",
                description: `تم حفظ بيانات مؤشرات الأداء ${period === 'weekly' ? 'الأسبوعية' : 'السنوية'} بنجاح`,
              });
              
              // Navigate to dashboard to see the changes
              navigate('/dashboard');
            }} 
          />
        </TabsContent>
        
        <TabsContent value="service" className="mt-6">
          <ServiceMetricsForm 
            period={period}
            onSubmit={(data) => {
              // Save to localStorage with period key
              const storageKey = `serviceData_${period}`;
              localStorage.setItem(storageKey, JSON.stringify(data));
              console.log(`Saving ${period} service metrics:`, data);
              toast({
                title: "تم الحفظ",
                description: `تم حفظ بيانات خدمة العملاء ${period === 'weekly' ? 'الأسبوعية' : 'السنوية'} بنجاح`,
              });
              
              // Navigate to dashboard to see the changes
              navigate('/dashboard');
            }}
          />
        </TabsContent>
        
        <TabsContent value="satisfaction" className="mt-6">
          <SatisfactionForm 
            period={period}
            onSubmit={(data) => {
              // Save to localStorage with period key
              const storageKey = `satisfactionData_${period}`;
              localStorage.setItem(storageKey, JSON.stringify(data));
              
              // Save comments separately with period key
              const commentsKey = `satisfactionComments_${period}`;
              localStorage.setItem(commentsKey, data.comments);
              
              console.log(`Saving ${period} satisfaction data:`, data);
              toast({
                title: "تم الحفظ",
                description: `تم حفظ بيانات رضا العملاء ${period === 'weekly' ? 'الأسبوعية' : 'السنوية'} بنجاح`,
              });
              
              // Navigate to dashboard to see the changes
              navigate('/dashboard');
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface FormProps {
  period: 'weekly' | 'yearly';
  onSubmit: (data: any) => void;
}

const PerformanceMetricsForm = ({ period, onSubmit }: FormProps) => {
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
  
  // Load saved data from localStorage based on period
  const [metrics, setMetrics] = useState(() => {
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

const ServiceMetricsForm = ({ period, onSubmit }: FormProps) => {
  const initialWeeklyCategories = [
    {
      title: 'المكالمات',
      metrics: [
        { id: 'complaints', label: 'شكاوى', value: 28 },
        { id: 'contactRequests', label: 'طلبات تواصل', value: 42 },
        { id: 'maintenanceRequests', label: 'طلبات صيانة', value: 65 },
        { id: 'inquiries', label: 'استفسارات', value: 58 },
        { id: 'officeAppointments', label: 'مهتمين مكاتب', value: 34 },
        { id: 'projectAppointments', label: 'مهتمين مشاريع', value: 38 },
        { id: 'interestedClients', label: 'عملاء مهتمين', value: 42 },
      ]
    },
    {
      title: 'الاستفسارات',
      metrics: [
        { id: 'generalInquiries', label: 'استفسارات عامة', value: 20 },
        { id: 'documentRequests', label: 'طلب أوراق', value: 10 },
        { id: 'suspectInquiries', label: 'استفسارات مشكوك', value: 8 },
        { id: 'apartmentRentals', label: 'إيجارات شقق', value: 12 },
        { id: 'availableProjects', label: 'مشاريع متاحة', value: 8 },
      ]
    },
    {
      title: 'طلبات الصيانة',
      metrics: [
        { id: 'cancelled', label: 'ملغية', value: 5 },
        { id: 'resolved', label: 'منجزة', value: 45 },
        { id: 'inProgress', label: 'قيد التنفيذ', value: 15 },
      ]
    },
  ];

  const initialYearlyCategories = [
    {
      title: 'المكالمات',
      metrics: [
        { id: 'complaints', label: 'شكاوى', value: 350 },
        { id: 'contactRequests', label: 'طلبات تواصل', value: 520 },
        { id: 'maintenanceRequests', label: 'طلبات صيانة', value: 780 },
        { id: 'inquiries', label: 'استفسارات', value: 650 },
        { id: 'officeAppointments', label: 'مهتمين مكاتب', value: 420 },
        { id: 'projectAppointments', label: 'مهتمين مشاريع', value: 480 },
        { id: 'interestedClients', label: 'عملاء مهتمين', value: 520 },
      ]
    },
    {
      title: 'الاستفسارات',
      metrics: [
        { id: 'generalInquiries', label: 'استفسارات عامة', value: 240 },
        { id: 'documentRequests', label: 'طلب أوراق', value: 120 },
        { id: 'suspectInquiries', label: 'استفسارات مشكوك', value: 90 },
        { id: 'apartmentRentals', label: 'إيجارات شقق', value: 150 },
        { id: 'availableProjects', label: 'مشاريع متاحة', value: 95 },
      ]
    },
    {
      title: 'طلبات الصيانة',
      metrics: [
        { id: 'cancelled', label: 'ملغية', value: 60 },
        { id: 'resolved', label: 'منجزة', value: 550 },
        { id: 'inProgress', label: 'قيد التنفيذ', value: 170 },
      ]
    },
  ];

  // Load saved data from localStorage based on period
  const [categories, setCategories] = useState(() => {
    const storageKey = `serviceData_${period}`;
    const savedData = localStorage.getItem(storageKey);
    return savedData ? JSON.parse(savedData) : (period === 'weekly' ? initialWeeklyCategories : initialYearlyCategories);
  });

  // Update categories when period changes
  useEffect(() => {
    const storageKey = `serviceData_${period}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      setCategories(JSON.parse(savedData));
    } else {
      setCategories(period === 'weekly' ? initialWeeklyCategories : initialYearlyCategories);
    }
  }, [period]);

  const updateMetricValue = (categoryIndex: number, metricId: string, value: number) => {
    setCategories(prevCategories => {
      const newCategories = [...prevCategories];
      const category = {...newCategories[categoryIndex]};
      category.metrics = category.metrics.map(metric => {
        if (metric.id === metricId) {
          return {...metric, value};
        }
        return metric;
      });
      newCategories[categoryIndex] = category;
      return newCategories;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(categories);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">
        بيانات خدمة العملاء - {period === 'weekly' ? 'أسبوعي' : 'سنوي'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category, categoryIndex) => (
          <Card key={category.title} className="p-6 bg-card/50">
            <h3 className="font-bold text-lg mb-4">{category.title}</h3>
            
            <div className="space-y-4">
              {category.metrics.map((metric) => (
                <div key={metric.id} className="space-y-2">
                  <label htmlFor={metric.id} className="block">{metric.label}</label>
                  <Input
                    id={metric.id}
                    type="number"
                    value={metric.value}
                    onChange={(e) => updateMetricValue(categoryIndex, metric.id, parseInt(e.target.value, 10))}
                    dir="ltr"
                    className="text-left"
                  />
                </div>
              ))}
              
              <div className="pt-4 border-t border-border mt-4">
                <div className="flex justify-between font-bold">
                  <span>المجموع</span>
                  <span>{category.metrics.reduce((sum, m) => sum + m.value, 0)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" className="w-32">تسجيل</Button>
      </div>
    </form>
  );
};

const SatisfactionForm = ({ period, onSubmit }: FormProps) => {
  const initialWeeklyCategories = [
    {
      title: 'الحل من أول مرة',
      metrics: [
        { id: 'firstTimeVeryGood', label: 'راضي جداً', value: 35 },
        { id: 'firstTimeGood', label: 'راضي', value: 38 },
        { id: 'firstTimeNeutral', label: 'محايد', value: 18 },
        { id: 'firstTimeBad', label: 'غير راضي', value: 6 },
        { id: 'firstTimeVeryBad', label: 'غير راضي جداً', value: 3 },
      ]
    },
    {
      title: 'وقت الإغلاق',
      metrics: [
        { id: 'closingTimeVeryGood', label: 'راضي جداً', value: 25 },
        { id: 'closingTimeGood', label: 'راضي', value: 45 },
        { id: 'closingTimeNeutral', label: 'محايد', value: 20 },
        { id: 'closingTimeBad', label: 'غير راضي', value: 7 },
        { id: 'closingTimeVeryBad', label: 'غير راضي جداً', value: 3 },
      ]
    },
    {
      title: 'جودة الخدمة',
      metrics: [
        { id: 'serviceQualityVeryGood', label: 'راضي جداً', value: 30 },
        { id: 'serviceQualityGood', label: 'راضي', value: 40 },
        { id: 'serviceQualityNeutral', label: 'محايد', value: 20 },
        { id: 'serviceQualityBad', label: 'غير راضي', value: 8 },
        { id: 'serviceQualityVeryBad', label: 'غير راضي جداً', value: 2 },
      ]
    },
  ];

  const initialYearlyCategories = [
    {
      title: 'الحل من أول مرة',
      metrics: [
        { id: 'firstTimeVeryGood', label: 'راضي جداً', value: 420 },
        { id: 'firstTimeGood', label: 'راضي', value: 500 },
        { id: 'firstTimeNeutral', label: 'محايد', value: 220 },
        { id: 'firstTimeBad', label: 'غير راضي', value: 80 },
        { id: 'firstTimeVeryBad', label: 'غير راضي جداً', value: 30 },
      ]
    },
    {
      title: 'وقت الإغلاق',
      metrics: [
        { id: 'closingTimeVeryGood', label: 'راضي جداً', value: 320 },
        { id: 'closingTimeGood', label: 'راضي', value: 550 },
        { id: 'closingTimeNeutral', label: 'محايد', value: 240 },
        { id: 'closingTimeBad', label: 'غير راضي', value: 90 },
        { id: 'closingTimeVeryBad', label: 'غير راضي جداً', value: 40 },
      ]
    },
    {
      title: 'جودة الخدمة',
      metrics: [
        { id: 'serviceQualityVeryGood', label: 'راضي جداً', value: 380 },
        { id: 'serviceQualityGood', label: 'راضي', value: 520 },
        { id: 'serviceQualityNeutral', label: 'محايد', value: 250 },
        { id: 'serviceQualityBad', label: 'غير راضي', value: 100 },
        { id: 'serviceQualityVeryBad', label: 'غير راضي جداً', value: 35 },
      ]
    },
  ];

  // Load saved data from localStorage based on period
  const [categories, setCategories] = useState(() => {
    const storageKey = `satisfactionData_${period}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return parsedData.categories || (period === 'weekly' ? initialWeeklyCategories : initialYearlyCategories);
    }
    return period === 'weekly' ? initialWeeklyCategories : initialYearlyCategories;
  });

  const [comments, setComments] = useState(() => {
    const commentsKey = `satisfactionComments_${period}`;
    return localStorage.getItem(commentsKey) || '';
  });

  // Update data when period changes
  useEffect(() => {
    // Update categories
    const storageKey = `satisfactionData_${period}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setCategories(parsedData.categories || (period === 'weekly' ? initialWeeklyCategories : initialYearlyCategories));
    } else {
      setCategories(period === 'weekly' ? initialWeeklyCategories : initialYearlyCategories);
    }
    
    // Update comments
    const commentsKey = `satisfactionComments_${period}`;
    const savedComments = localStorage.getItem(commentsKey);
    setComments(savedComments || '');
  }, [period]);

  const updateMetricValue = (categoryIndex: number, metricId: string, value: number) => {
    setCategories(prevCategories => {
      const newCategories = [...prevCategories];
      const category = {...newCategories[categoryIndex]};
      category.metrics = category.metrics.map(metric => {
        if (metric.id === metricId) {
          return {...metric, value};
        }
        return metric;
      });
      newCategories[categoryIndex] = category;
      return newCategories;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({categories, comments});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">
        بيانات رضا العملاء - {period === 'weekly' ? 'أسبوعي' : 'سنوي'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category, categoryIndex) => (
          <Card key={category.title} className="p-6 bg-card/50">
            <h3 className="font-bold text-lg mb-4">{category.title}</h3>
            
            <div className="space-y-4">
              {category.metrics.map((metric) => (
                <div key={metric.id} className="space-y-2">
                  <label htmlFor={metric.id} className="block">{metric.label}</label>
                  <Input
                    id={metric.id}
                    type="number"
                    value={metric.value}
                    onChange={(e) => updateMetricValue(categoryIndex, metric.id, parseInt(e.target.value, 10))}
                    dir="ltr"
                    className="text-left"
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="p-6 bg-card/50">
        <h3 className="font-bold text-lg mb-4">ملاحظات</h3>
        <Textarea 
          placeholder="أضف تعليقاتك هنا..." 
          className="min-h-32"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" className="w-32">تسجيل</Button>
      </div>
    </form>
  );
};

export default DataEntry;
