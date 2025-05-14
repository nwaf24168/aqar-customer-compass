
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SatisfactionData, fetchSatisfactionData } from '@/services/satisfaction-service';

interface SatisfactionFormProps {
  period: 'weekly' | 'yearly';
  isUserAuthenticated: boolean;
  onSubmit: (data: SatisfactionData) => void;
}

const SatisfactionForm = ({ period, isUserAuthenticated, onSubmit }: SatisfactionFormProps) => {
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
    // Save to localStorage first as backup
    const storageKey = `satisfactionData_${period}`;
    localStorage.setItem(storageKey, JSON.stringify(satisfactionData));
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
      
      {!isUserAuthenticated && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md mb-4">
          تنبيه: أنت غير مسجل الدخول. سيتم حفظ البيانات محلياً فقط وقد تفقد عند مسح ذاكرة المتصفح.
        </div>
      )}
      
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

export default SatisfactionForm;
