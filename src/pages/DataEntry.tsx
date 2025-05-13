
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { saveMetrics } from '@/services/metrics-service';
import { saveServiceData, fetchServiceData, ServiceCategory } from '@/services/service-data-service';
import { saveSatisfactionData, fetchSatisfactionData, SatisfactionData } from '@/services/satisfaction-service';

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
            onSubmit={async (data) => {
              try {
                // تجهيز البيانات للحفظ في قاعدة البيانات
                const metricsForDb = data.map(metric => ({
                  period,
                  date: new Date().toISOString().split('T')[0],
                  category: 'performance',
                  name: metric.id,
                  value: metric.value,
                  goal: metric.goal,
                  change: 0, // يمكن حسابها لاحقًا
                  achieved: metric.achieved
                }));
                
                // حفظ البيانات في قاعدة البيانات
                await saveMetrics(metricsForDb);
                
                toast({
                  title: "تم الحفظ",
                  description: `تم حفظ بيانات مؤشرات الأداء ${period === 'weekly' ? 'الأسبوعية' : 'السنوية'} بنجاح`,
                });
                
                // الانتقال إلى لوحة التحكم لمشاهدة التغييرات
                navigate('/dashboard');
              } catch (error) {
                console.error('Error saving performance metrics:', error);
                toast({
                  title: "خطأ في الحفظ",
                  description: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.",
                  variant: "destructive"
                });
              }
            }} 
          />
        </TabsContent>
        
        <TabsContent value="service" className="mt-6">
          <ServiceMetricsForm 
            period={period}
            onSubmit={async (data) => {
              try {
                // حفظ البيانات في قاعدة البيانات
                await saveServiceData(data, period);
                
                toast({
                  title: "تم الحفظ",
                  description: `تم حفظ بيانات خدمة العملاء ${period === 'weekly' ? 'الأسبوعية' : 'السنوية'} بنجاح`,
                });
                
                // الانتقال إلى لوحة التحكم لمشاهدة التغييرات
                navigate('/dashboard');
              } catch (error) {
                console.error('Error saving service metrics:', error);
                toast({
                  title: "خطأ في الحفظ",
                  description: "حدث خطأ أثناء حفظ بيانات خدمة العملاء. يرجى المحاولة مرة أخرى.",
                  variant: "destructive"
                });
              }
            }}
          />
        </TabsContent>
        
        <TabsContent value="satisfaction" className="mt-6">
          <SatisfactionForm 
            period={period}
            onSubmit={async (data) => {
              try {
                // حفظ البيانات في قاعدة البيانات
                await saveSatisfactionData(data, period);
                
                toast({
                  title: "تم الحفظ",
                  description: `تم حفظ بيانات رضا العملاء ${period === 'weekly' ? 'الأسبوعية' : 'السنوية'} بنجاح`,
                });
                
                // الانتقال إلى لوحة التحكم لمشاهدة التغييرات
                navigate('/dashboard');
              } catch (error) {
                console.error('Error saving satisfaction data:', error);
                toast({
                  title: "خطأ في الحفظ",
                  description: "حدث خطأ أثناء حفظ بيانات رضا العملاء. يرجى المحاولة مرة أخرى.",
                  variant: "destructive"
                });
              }
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
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadServiceData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchServiceData(period);
        setCategories(data);
      } catch (error) {
        console.error('Error loading service data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServiceData();
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

  if (isLoading) {
    return <div className="text-center py-8">جاري تحميل البيانات...</div>;
  }

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
  const [satisfactionData, setSatisfactionData] = useState<SatisfactionData>({
    categories: [],
    comments: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSatisfactionData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSatisfactionData(period);
        setSatisfactionData(data);
      } catch (error) {
        console.error('Error loading satisfaction data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSatisfactionData();
  }, [period]);

  const updateMetricValue = (categoryIndex: number, metricId: string, value: number) => {
    setSatisfactionData(prevData => {
      const newCategories = [...prevData.categories];
      const category = {...newCategories[categoryIndex]};
      category.metrics = category.metrics.map(metric => {
        if (metric.id === metricId) {
          return {...metric, value};
        }
        return metric;
      });
      newCategories[categoryIndex] = category;
      return {
        ...prevData,
        categories: newCategories
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(satisfactionData);
  };

  if (isLoading) {
    return <div className="text-center py-8">جاري تحميل البيانات...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">
        بيانات رضا العملاء - {period === 'weekly' ? 'أسبوعي' : 'سنوي'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {satisfactionData.categories.map((category, categoryIndex) => (
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
          value={satisfactionData.comments}
          onChange={(e) => setSatisfactionData(prev => ({...prev, comments: e.target.value}))}
        />
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" className="w-32">تسجيل</Button>
      </div>
    </form>
  );
};

export default DataEntry;
