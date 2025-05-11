
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Users, Clock, LineChart, Percent } from 'lucide-react';

// This is mock data that would normally come from Supabase
const metrics = [
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

// Service data
const serviceData = [
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

// Customer satisfaction data
const satisfactionData = [
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

const Dashboard = () => {
  const [period, setPeriod] = useState<'weekly' | 'yearly'>('weekly');

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
        <Card className="bg-card/50 p-6 min-h-24"></Card>
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
