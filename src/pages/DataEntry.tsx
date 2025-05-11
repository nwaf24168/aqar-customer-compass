
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const DataEntry = () => {
  const [period, setPeriod] = useState<'weekly' | 'yearly'>('weekly');
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "تم الحفظ",
      description: "تم حفظ البيانات بنجاح",
    });
  };
  
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
          <PerformanceMetricsForm onSubmit={handleSubmit} />
        </TabsContent>
        
        <TabsContent value="service" className="mt-6">
          <ServiceMetricsForm onSubmit={handleSubmit} />
        </TabsContent>
        
        <TabsContent value="satisfaction" className="mt-6">
          <SatisfactionForm onSubmit={handleSubmit} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
}

const PerformanceMetricsForm = ({ onSubmit }: FormProps) => {
  const metrics = [
    { id: 'deliveryQuality', label: 'جودة التسليم', goal: 100, value: 98, achieved: true },
    { id: 'oldClientReferral', label: 'نسبة الترشيح للعملاء القدامى', goal: 30, value: 30, achieved: true },
    { id: 'afterYearReferral', label: 'نسبة الترشيح بعد السنة', goal: 65, value: 67, achieved: true },
    { id: 'newClientReferral', label: 'نسبة الترشيح للعملاء الجدد', goal: 65, value: 65, achieved: true },
    { id: 'deliveryQuality', label: 'جودة التسليم', goal: 100, value: 98, achieved: true },
    { id: 'maintenanceQuality', label: 'جودة الصيانة', goal: 100, value: 96, achieved: true },
    { id: 'responseTime', label: 'عدد الثواني للرد', goal: 3, value: 2.8, achieved: true },
    { id: 'csat', label: 'راحة العميل (CSAT)', goal: 70, value: 74, achieved: true },
    { id: 'callResponseRate', label: 'معدل الرد على المكالمات', goal: 80, value: 18, achieved: false },
    { id: 'maintenanceClosureSpeed', label: 'سرعة إغلاق طلبات الصيانة', goal: 3, value: 2.5, achieved: true },
    { id: 'reopenRequests', label: 'عدد إعادة فتح طلب', goal: 0, value: 0, achieved: true },
    { id: 'facilityManagementQuality', label: 'جودة إدارة المرافق', goal: 80, value: 80, achieved: true },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">مؤشرات الأداء الرئيسية - أسبوعي</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.id} className="p-6 bg-card/50">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label htmlFor={metric.id} className="font-medium">{metric.label}</label>
                <span className="text-sm">الهدف: {metric.goal}</span>
              </div>
              
              <Input 
                id={metric.id}
                type="number"
                defaultValue={metric.value}
                step="0.1"
                dir="ltr"
                className="text-left"
              />
              
              <div className={`py-1 px-3 text-center text-sm rounded ${
                metric.achieved 
                  ? 'bg-emerald-500/20 text-emerald-500' 
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {metric.achieved ? 'تم تحقيق الهدف' : 'لم يتم تحقيق الهدف'}
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

const ServiceMetricsForm = ({ onSubmit }: FormProps) => {
  const categories = [
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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">بيانات خدمة العملاء</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.title} className="p-6 bg-card/50">
            <h3 className="font-bold text-lg mb-4">{category.title}</h3>
            
            <div className="space-y-4">
              {category.metrics.map((metric) => (
                <div key={metric.id} className="space-y-2">
                  <label htmlFor={metric.id} className="block">{metric.label}</label>
                  <Input
                    id={metric.id}
                    type="number"
                    defaultValue={metric.value}
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

const SatisfactionForm = ({ onSubmit }: FormProps) => {
  const categories = [
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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-xl font-bold">بيانات رضا العملاء</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.title} className="p-6 bg-card/50">
            <h3 className="font-bold text-lg mb-4">{category.title}</h3>
            
            <div className="space-y-4">
              {category.metrics.map((metric) => (
                <div key={metric.id} className="space-y-2">
                  <label htmlFor={metric.id} className="block">{metric.label}</label>
                  <Input
                    id={metric.id}
                    type="number"
                    defaultValue={metric.value}
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
        />
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" className="w-32">تسجيل</Button>
      </div>
    </form>
  );
};

export default DataEntry;
