
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { saveMetrics } from '@/services/metrics-service';
import { saveServiceData } from '@/services/service-data-service';
import { saveSatisfactionData } from '@/services/satisfaction-service';

// Import component forms
import PerformanceMetricsForm from '@/components/data-entry/PerformanceMetricsForm';
import ServiceMetricsForm from '@/components/data-entry/ServiceMetricsForm';
import SatisfactionForm from '@/components/data-entry/SatisfactionForm';

const DataEntry = () => {
  const [period, setPeriod] = useState<'weekly' | 'yearly'>('weekly');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsUserAuthenticated(!!data.user);
      
      if (!data.user) {
        toast({
          title: "تنبيه",
          description: "يجب تسجيل الدخول لحفظ البيانات",
          variant: "destructive",
        });
      }
    };
    
    checkAuth();
  }, [toast]);
  
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
            isUserAuthenticated={isUserAuthenticated}
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
                const success = await saveMetrics(metricsForDb);
                
                if (success) {
                  toast({
                    title: "تم الحفظ",
                    description: `تم حفظ بيانات مؤشرات الأداء ${period === 'weekly' ? 'الأسبوعية' : 'السنوية'} بنجاح`,
                  });
                } else {
                  toast({
                    title: "تنبيه",
                    description: "تم حفظ البيانات محليًا فقط. سيتم مزامنتها مع قاعدة البيانات عند تسجيل الدخول",
                    variant: "destructive",
                  });
                }
                
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
            isUserAuthenticated={isUserAuthenticated}
            onSubmit={async (data) => {
              try {
                // حفظ البيانات في قاعدة البيانات
                const success = await saveServiceData(data, period);
                
                if (success) {
                  toast({
                    title: "تم الحفظ",
                    description: `تم حفظ بيانات خدمة العملاء ${period === 'weekly' ? 'الأسبوعية' : 'السنوية'} بنجاح`,
                  });
                } else {
                  toast({
                    title: "تنبيه",
                    description: "تم حفظ البيانات محليًا فقط. سيتم مزامنتها مع قاعدة البيانات عند تسجيل الدخول",
                    variant: "destructive",
                  });
                }
                
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
            isUserAuthenticated={isUserAuthenticated}
            onSubmit={async (data) => {
              try {
                // حفظ البيانات في قاعدة البيانات
                const success = await saveSatisfactionData(data, period);
                
                if (success) {
                  toast({
                    title: "تم الحفظ",
                    description: `تم حفظ بيانات رضا العملاء ${period === 'weekly' ? 'الأسبوعية' : 'السنوية'} بنجاح`,
                  });
                } else {
                  toast({
                    title: "تنبيه",
                    description: "تم حفظ البيانات محليًا فقط. سيتم مزامنتها مع قاعدة البيانات عند تسجيل الدخول",
                    variant: "destructive",
                  });
                }
                
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

export default DataEntry;
