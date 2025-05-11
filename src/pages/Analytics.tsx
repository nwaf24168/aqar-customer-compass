
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from 'recharts';

const npsData = [
  { week: 'الأسبوع 1', oldClients: 30, afterYear: 60, newClients: 60, average: 56 },
  { week: 'الأسبوع 2', oldClients: 32, afterYear: 62, newClients: 61, average: 58 },
  { week: 'الأسبوع 3', oldClients: 33, afterYear: 65, newClients: 63, average: 60 },
  { week: 'الأسبوع 4', oldClients: 34, afterYear: 65, newClients: 64, average: 61 },
];

const callDistributionData = [
  { name: 'شكاوى', value: 28, color: '#34D399' },
  { name: 'طلبات تواصل', value: 42, color: '#60A5FA' },
  { name: 'طلبات صيانة', value: 65, color: '#FBBF24' },
  { name: 'استفسارات', value: 58, color: '#A78BFA' },
  { name: 'مهتمين مكاتب', value: 34, color: '#F87171' },
  { name: 'مهتمين مشاريع', value: 38, color: '#2DD4BF' }
];

const customerServicePerformanceData = [
  { name: 'إجمالي المكالمات', value: 307, color: '#8B5CF6' },
  { name: 'تم الحل', value: 45, color: '#34D399' },
  { name: 'قيد المعالجة', value: 15, color: '#FBBF24' },
  { name: 'ملغية', value: 5, color: '#F87171' },
  { name: 'معدل الحل', value: 18, color: '#60A5FA' }
];

const satisfactionData = [
  { name: 'راضي جداً', value: 30, color: '#34D399' },
  { name: 'راضي', value: 40, color: '#60A5FA' },
  { name: 'محايد', value: 20, color: '#FBBF24' },
  { name: 'غير راضي', value: 8, color: '#F87171' },
  { name: 'غير راضي جداً', value: 2, color: '#EC4899' }
];

const satisfactionRadarData = [
  { subject: 'جودة الخدمة', راضي_جداً: 70, راضي: 50, محايد: 30 },
  { subject: 'وقت الإغلاق', راضي_جداً: 60, راضي: 45, محايد: 40 },
  { subject: 'الحل من أول مرة', راضي_جداً: 75, راضي: 60, محايد: 35 }
];

const colors = {
  green: '#34D399',
  blue: '#60A5FA',
  purple: '#A78BFA',
  yellow: '#FBBF24',
  red: '#F87171',
  teal: '#2DD4BF',
  indigo: '#8B5CF6'
};

const Analytics = () => {
  const [period, setPeriod] = useState<'weekly' | 'yearly'>('weekly');

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">تحليلات الأداء والنتائج</h1>
        
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

      <Tabs defaultValue="nps" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="nps">تحليلات رضا العملاء</TabsTrigger>
          <TabsTrigger value="service">تحليلات خدمة العملاء</TabsTrigger>
          <TabsTrigger value="qos">تحليلات NPS والجودة</TabsTrigger>
        </TabsList>

        <TabsContent value="nps" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50">
              <h3 className="text-lg font-bold mb-4">مستوى رضا العملاء</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={satisfactionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {satisfactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                    <Tooltip formatter={(value) => `${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6 bg-card/50">
              <h3 className="text-lg font-bold mb-4">تحليل اتجاهات الرضا</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={satisfactionRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <Radar name="راضي جداً" dataKey="راضي_جداً" stroke={colors.green} fill={colors.green} fillOpacity={0.6} />
                    <Radar name="راضي" dataKey="راضي" stroke={colors.blue} fill={colors.blue} fillOpacity={0.6} />
                    <Radar name="محايد" dataKey="محايد" stroke={colors.yellow} fill={colors.yellow} fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-card/50">
            <h3 className="text-lg font-bold mb-4">آخر التعليقات والملاحظات</h3>
            <div className="min-h-20">
              {/* Content would be populated from backend */}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="service" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50">
              <h3 className="text-lg font-bold mb-4">توزيع المكالمات حسب النوع</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={callDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {callDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                    <Tooltip formatter={(value) => `${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="p-6 bg-card/50">
              <h3 className="text-lg font-bold mb-4">أداء خدمة العملاء</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerServicePerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke={colors.indigo} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="qos" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 bg-card/50">
              <h3 className="font-bold text-lg">NPS - عملاء قدامى</h3>
              <div className="text-3xl font-bold mt-4 text-indigo-400">33.8%</div>
            </Card>
            
            <Card className="p-6 bg-card/50">
              <h3 className="font-bold text-lg">NPS - بعد السنة</h3>
              <div className="text-3xl font-bold mt-4 text-blue-400">64.8%</div>
            </Card>
            
            <Card className="p-6 bg-card/50">
              <h3 className="font-bold text-lg">NPS - عملاء جدد</h3>
              <div className="text-3xl font-bold mt-4 text-green-400">63.8%</div>
            </Card>
          </div>

          <Card className="p-6 bg-card/50">
            <h3 className="text-lg font-bold mb-4">NPS أسبوعي - تطور مؤشر</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={npsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="oldClients" name="عملاء قدامى" stroke={colors.red} strokeWidth={2} />
                  <Line type="monotone" dataKey="afterYear" name="بعد السنة الأولى" stroke={colors.blue} strokeWidth={2} />
                  <Line type="monotone" dataKey="newClients" name="عملاء جدد" stroke={colors.green} strokeWidth={2} />
                  <Line type="monotone" dataKey="average" name="المتوسط" stroke={colors.yellow} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 bg-card/50">
            <h3 className="text-lg font-bold mb-4">تحليل الجودة الشامل - أسبوعي</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={satisfactionRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <Radar name="الأسبوع 1" dataKey="راضي_جداً" stroke={colors.yellow} fill={colors.yellow} fillOpacity={0.6} />
                  <Radar name="الأسبوع 2" dataKey="راضي" stroke={colors.yellow} fill={colors.yellow} fillOpacity={0.4} />
                  <Radar name="الأسبوع 3" dataKey="محايد" stroke={colors.yellow} fill={colors.yellow} fillOpacity={0.2} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
