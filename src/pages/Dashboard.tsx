import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Users, Clock, LineChart, Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// This is mock data that would normally come from Supabase
const defaultMetrics = [
  {
    id: '1',
    name: 'جودة التسليم',
    value: 98,
    goal: 100,
    change: 1.5,
    icon: <LineChart className="h-6 w-6" />,
    achieved: true,
    color: 'bg-amber-500/20 text-amber-500',
  },
  {
    id: '2',
    name: 'نسبة الترشيح للعملاء القدامى',
    value: 30,
    goal: 30,
    change: 1.8,
    icon: <Users className="h-6 w-6" />,
    achieved: true,
    color: 'bg-emerald-500/20 text-emerald-500',
  },
  {
    id: '3',
    name: 'نسبة الترشيح بعد السنة',
    value: 67,
    goal: 65,
    change: 3.1,
    icon: <Users className="h-6 w-6" />,
    achieved: true,
    color: 'bg-emerald-500/20 text-emerald-500',
  },
  {
    id: '4',
    name: 'نسبة الترشيح للعملاء الجدد',
    value: 65,
    goal: 65,
    change: 2.4,
    icon: <Users className="h-6 w-6" />,
    achieved: true,
    color: 'bg-emerald-500/20 text-emerald-500',
  },
  {
    id: '5',
    name: 'راحة العميل (CSAT)',
    value: 74,
    goal: 70,
    change: 5.7,
    icon: <Users className="h-6 w-6" />,
    achieved: true,
    color: 'bg-emerald-500/20 text-emerald-500',
  },
  {
    id: '6',
    name: 'معدل الرد على المكالمات',
    value: 18,
    goal: 80,
    change: 4.3,
    icon: <Clock className="h-6 w-6" />,
    achieved: false,
    color: 'bg-red-500/20 text-red-500',
  },
  {
    id: '7',
    name: 'عدد الثواني للرد',
    value: 2.8,
    goal: 3,
    change: 5.7,
    icon: <Clock className="h-6 w-6" />,
    achieved: true,
    color: 'bg-emerald-500/20 text-emerald-500',
  },
  {
    id: '8',
    name: 'جودة الصيانة',
    value: 96,
    goal: 100,
    change: 2.8,
    icon: <LineChart className="h-6 w-6" />,
    achieved: true,
    color: 'bg-amber-500/20 text-amber-500',
  },
  {
    id: '9',
    name: 'معدل التحول',
    value: 2,
    goal: 2,
    change: 1.5,
    icon: <Percent className="h-6 w-6" />,
    achieved: true,
    color: 'bg-emerald-500/20 text-emerald-500',
  },
  {
    id: '10',
    name: 'جودة إدارة المرافق',
    value: 80,
    goal: 80,
    change: 1.8,
    icon: <LineChart className="h-6 w-6" />,
    achieved: true,
    color: 'bg-emerald-500/20 text-emerald-500',
  },
  {
    id: '11',
    name: 'عدد إعادة فتح طلب',
    value: 0,
    goal: 0,
    change: 0,
    icon: <LineChart className="h-6 w-6" />,
    achieved: true,
    color: 'bg-emerald-500/20 text-emerald-500',
  },
  {
    id: '12',
    name: 'سرعة إغلاق طلبات الصيانة',
    value: 2.5,
    goal: 3,
    change: 8.2,
    icon: <Clock className="h-6 w-6" />,
    achieved: true,
    color: 'bg-emerald-500/20 text-emerald-500',
  },
];

// Default service data
const defaultServiceData = [
  {
    title: 'المكالمات',
    items: [
      { name: 'شكاوى', value: 28 },
      { name: 'طلبات تواصل', value: 42 },
      { name: 'طلبات صيانة', value: 65 },
      { name: 'استفسارات', value: 58 },
      { name: 'مهتمين مكاتب', value: 34 },
      { name: 'مهتمين مشاريع', value: 38 },
      { name: 'عملاء مهتمين', value: 42 },
      { name: 'إجمالي المكالمات', value: 307 },
    ]
  },
  {
    title: 'الاستفسارات',
    items: [
      { name: 'استفسارات عامة', value: 20 },
      { name: 'طلب أوراق', value: 10 },
      { name: 'استفسارات مشكوك', value: 8 },
      { name: 'إيجارات شقق', value: 12 },
      { name: 'مشاريع متاحة', value: 8 },
      { name: 'إجمالي الاستفسارات', value: 58 },
    ]
  },
  {
    title: 'حالة طلبات الصيانة',
    items: [
      { name: 'تم الإلغاء', value: 5 },
      { name: 'تم الحل', value: 45 },
      { name: 'قيد المعالجة', value: 15 },
      { name: 'إجمالي طلبات الصيانة', value: 65 },
    ]
  },
];

// Default customer satisfaction data
const defaultSatisfactionData = [
  {
    title: 'نسبة الحل من أول مرة',
    percentage: '74.0%',
  },
  {
    title: 'رضا العملاء عن مدة الإغلاق',
    percentage: '70.5%',
  },
  {
    title: 'رضا العملاء عن الخدمات',
    percentage: '72.0%',
  }
];

// Helper function to determine the color based on achievement level
const getMetricStatusColor = (value: number, goal: number) => {
  const achievementRatio = (value / goal) * 100;
  
  if (value >= goal) {
    return 'bg-emerald-500/20 text-emerald-500'; // Green for achieved
  } else if (achievementRatio >= 90) {
    return 'bg-amber-500/20 text-amber-500'; // Yellow for close to goal (90%+)
  } else {
    return 'bg-red-500/20 text-red-500'; // Red for far from goal
  }
};

// Convert performance metrics from form to dashboard format
const convertPerformanceMetricsToFormat = (formMetrics: any[]): any[] => {
  if (!formMetrics) return defaultMetrics;

  const iconMap: Record<string, React.ReactNode> = {
    'deliveryQuality': <LineChart className="h-6 w-6" />,
    'oldClientReferral': <Users className="h-6 w-6" />,
    'afterYearReferral': <Users className="h-6 w-6" />,
    'newClientReferral': <Users className="h-6 w-6" />,
    'csat': <Users className="h-6 w-6" />,
    'callResponseRate': <Clock className="h-6 w-6" />,
    'responseTime': <Clock className="h-6 w-6" />,
    'maintenanceQuality': <LineChart className="h-6 w-6" />,
    'conversionRate': <Percent className="h-6 w-6" />,
    'facilityManagementQuality': <LineChart className="h-6 w-6" />,
    'reopenRequests': <LineChart className="h-6 w-6" />,
    'maintenanceClosureSpeed': <Clock className="h-6 w-6" />,
  };
  
  const nameMap: Record<string, string> = {
    'deliveryQuality': 'جودة التسليم',
    'oldClientReferral': 'نسبة الترشيح للعملاء القدامى',
    'afterYearReferral': 'نسبة الترشيح بعد السنة',
    'newClientReferral': 'نسبة الترشيح للعملاء الجدد',
    'csat': 'راحة العميل (CSAT)',
    'callResponseRate': 'معدل الرد على المكالمات',
    'responseTime': 'عدد الثواني للرد',
    'maintenanceQuality': 'جودة الصيانة',
    'conversionRate': 'معدل التحول',
    'facilityManagementQuality': 'جودة إدارة المرافق',
    'reopenRequests': 'عدد إعادة فتح طلب',
    'maintenanceClosureSpeed': 'سرعة إغلاق طلبات الصيانة',
  };

  const metrics = formMetrics.map((metric, index) => {
    const achieved = metric.value >= metric.goal;
    const color = getMetricStatusColor(metric.value, metric.goal);
    const name = nameMap[metric.id] || metric.label || 'مؤشر';
    const icon = iconMap[metric.id] || <LineChart className="h-6 w-6" />;
    
    return {
      id: String(index + 1),
      name,
      value: metric.value,
      goal: metric.goal,
      change: Math.random() * 5, // Just a random change for now
      icon,
      achieved,
      color,
    };
  });
  
  return metrics;
};

// Convert service data from form to dashboard format
const convertServiceDataToFormat = (formCategories: any[]): any[] => {
  if (!formCategories) return defaultServiceData;

  return formCategories.map(category => {
    const items = [...category.metrics];
    const total = items.reduce((sum, item) => sum + item.value, 0);
    
    if (category.title === 'المكالمات') {
      items.push({ name: 'إجمالي المكالمات', value: total });
    } else if (category.title === 'الاستفسارات') {
      items.push({ name: 'إجمالي الاستفسارات', value: total });
    } else if (category.title === 'طلبات الصيانة') {
      items.push({ name: 'إجمالي طلبات الصيانة', value: total });
    }
    
    return {
      title: category.title,
      items: items.map(item => ({
        name: item.label || item.name,
        value: item.value
      }))
    };
  });
};

// Calculate satisfaction percentages from form data
const calculateSatisfactionPercentages = (satisfactionData: any): any[] => {
  if (!satisfactionData || !satisfactionData.categories) return defaultSatisfactionData;

  const { categories } = satisfactionData;
  
  const calculatePercentage = (category: any) => {
    const total = category.metrics.reduce((sum: number, metric: any) => sum + metric.value, 0);
    if (total === 0) return 0;
    
    const weightedSum = 
      category.metrics[0].value * 5 + // راضي جداً (5 نقاط)
      category.metrics[1].value * 4 + // راضي (4 نقاط)
      category.metrics[2].value * 3 + // محايد (3 نقاط)
      category.metrics[3].value * 2 + // غير راضي (2 نقاط)
      category.metrics[4].value * 1;  // غير راضي جداً (1 نقطة)
    
    return (weightedSum / (total * 5)) * 100;
  };
  
  const firstTimePercentage = calculatePercentage(categories[0]);
  const closingTimePercentage = calculatePercentage(categories[1]);
  const serviceQualityPercentage = calculatePercentage(categories[2]);
  
  return [
    {
      title: 'نسبة الحل من أول مرة',
      percentage: `${firstTimePercentage.toFixed(1)}%`,
    },
    {
      title: 'رضا العملاء عن مدة الإغلاق',
      percentage: `${closingTimePercentage.toFixed(1)}%`,
    },
    {
      title: 'رضا العملاء عن الخدمات',
      percentage: `${serviceQualityPercentage.toFixed(1)}%`,
    }
  ];
};

const Dashboard = () => {
  const [period, setPeriod] = useState<'weekly' | 'yearly'>('weekly');
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [serviceData, setServiceData] = useState(defaultServiceData);
  const [satisfactionData, setSatisfactionData] = useState(defaultSatisfactionData);
  const [customerComments, setCustomerComments] = useState('');
  const { toast } = useToast();
  
  // Load saved data from localStorage
  useEffect(() => {
    // Load performance metrics
    const savedPerformanceMetrics = localStorage.getItem('performanceMetrics');
    if (savedPerformanceMetrics) {
      const parsedMetrics = JSON.parse(savedPerformanceMetrics);
      setMetrics(convertPerformanceMetricsToFormat(parsedMetrics));
    }
    
    // Load service data
    const savedServiceData = localStorage.getItem('serviceData');
    if (savedServiceData) {
      const parsedServiceData = JSON.parse(savedServiceData);
      setServiceData(convertServiceDataToFormat(parsedServiceData));
    }
    
    // Load satisfaction data
    const savedSatisfactionData = localStorage.getItem('satisfactionData');
    if (savedSatisfactionData) {
      const parsedSatisfactionData = JSON.parse(savedSatisfactionData);
      setSatisfactionData(calculateSatisfactionPercentages(parsedSatisfactionData));
      
      // Set customer comments if available
      if (parsedSatisfactionData.comments) {
        setCustomerComments(parsedSatisfactionData.comments);
      }
    }
    
    // Load comments separately as well
    const savedComments = localStorage.getItem('satisfactionComments');
    if (savedComments) {
      setCustomerComments(savedComments);
    }
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">لوحة التحكم الرئيسية</h1>
        
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

      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">مؤشرات الأداء الرئيسية الأسبوعية</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">خدمة العملاء الأسبوعية</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceData.map((category, idx) => (
            <ServiceCard key={idx} data={category} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">رضا العملاء عن الخدمات</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {satisfactionData.map((item, idx) => (
            <SatisfactionCard key={idx} data={item} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">ملاحظات العملاء</h2>
        <Card className="bg-card/50 p-6 min-h-24">
          {customerComments ? (
            <p className="whitespace-pre-line">{customerComments}</p>
          ) : (
            <p className="text-muted-foreground">لا توجد ملاحظات حالياً</p>
          )}
        </Card>
      </div>
    </div>
  );
};

interface MetricCardProps {
  metric: {
    name: string;
    value: number;
    goal: number;
    change: number;
    icon?: React.ReactNode;
    achieved: boolean;
    color: string;
  };
}

const MetricCard = ({ metric }: MetricCardProps) => {
  // Get the status text and badge color based on achievement
  const getStatusBadge = () => {
    if (metric.achieved) {
      return <div className="py-1 px-2 text-xs bg-emerald-500/20 text-emerald-500 rounded-md">تم تحقيق الهدف</div>;
    }
    
    const ratio = (metric.value / metric.goal) * 100;
    if (ratio >= 90) {
      return <div className="py-1 px-2 text-xs bg-amber-500/20 text-amber-500 rounded-md">قريب من الهدف</div>;
    }
    
    return <div className="py-1 px-2 text-xs bg-red-500/20 text-red-500 rounded-md">لم يتم تحقيق الهدف</div>;
  };

  return (
    <Card className="bg-card/50 p-6">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div className={`p-2 rounded-md ${metric.color}`}>
            {metric.icon}
          </div>
          <span className="flex items-center text-sm">
            {metric.change}%
            {metric.change > 0 ? (
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500" />
            )}
          </span>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm text-muted-foreground">{metric.name}</h3>
          <div className="mt-1 text-3xl font-bold">
            {typeof metric.value === 'number' && !Number.isInteger(metric.value)
              ? metric.value.toFixed(1)
              : metric.value}
            {typeof metric.value === 'number' && !Number.isInteger(metric.value)
              ? metric.name.includes('عدد الثواني') ? ' ثانية' : ''
              : metric.name.includes('نسبة') || metric.name.includes('جودة') ? '%' : ''}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            الهدف: {metric.goal}
            {metric.name.includes('نسبة') || metric.name.includes('جودة') ? '%' : 
              metric.name.includes('عدد الثواني') ? ' ثواني' : ''}
          </div>
          <div className="mt-2">
            {getStatusBadge()}
          </div>
        </div>
      </div>
    </Card>
  );
};

interface ServiceCardProps {
  data: {
    title: string;
    items: { name: string; value: number }[];
  };
}

const ServiceCard = ({ data }: ServiceCardProps) => {
  return (
    <Card className="bg-card/50 p-6">
      <h3 className="text-lg font-bold mb-4">{data.title}</h3>
      <div className="space-y-3">
        {data.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className={`${item.name.includes('إجمالي') ? 'font-bold' : ''}`}>
              {item.name}
            </span>
            <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

interface SatisfactionCardProps {
  data: {
    title: string;
    percentage: string;
  };
}

const SatisfactionCard = ({ data }: SatisfactionCardProps) => {
  return (
    <Card className="bg-amber-900/30 p-6 text-center">
      <div className="text-5xl font-bold mb-2">😊</div>
      <div className="text-3xl font-bold text-amber-400 mb-2">{data.percentage}</div>
      <div className="text-sm text-muted-foreground">{data.title}</div>
    </Card>
  );
};

export default Dashboard;
