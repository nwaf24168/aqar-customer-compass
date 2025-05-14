
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ServiceCategory, fetchServiceData } from '@/services/service-data-service';

interface ServiceMetricsFormProps {
  period: 'weekly' | 'yearly';
  isUserAuthenticated: boolean;
  onSubmit: (data: ServiceCategory[]) => void;
}

const ServiceMetricsForm = ({ period, isUserAuthenticated, onSubmit }: ServiceMetricsFormProps) => {
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
    // Save to localStorage first as backup
    const storageKey = `serviceData_${period}`;
    localStorage.setItem(storageKey, JSON.stringify(categories));
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
      
      {!isUserAuthenticated && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4">
          تنبيه: أنت غير مسجل الدخول. سيتم حفظ البيانات محلياً فقط وقد تفقد عند مسح ذاكرة المتصفح.
        </div>
      )}
      
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

export default ServiceMetricsForm;
