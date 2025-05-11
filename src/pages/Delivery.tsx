
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trash, 
  FileEdit, 
  Eye, 
  Plus, 
  Search, 
  ArrowDownUp, 
  Filter, 
  Download, 
  FileText 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Reservation } from '@/types';

// Mock reservation data
const mockReservations: Reservation[] = [
  {
    id: '1',
    reservationNumber: '1',
    clientName: 'تركي السعيد',
    project: 'المعالي',
    unit: '26',
    date: '2024-12-17',
    status: 'مكتملة بيانات راحة العملاء',
    salesData: {
      paymentMethod: 'بنك',
      saleType: 'جاهز',
      unitValue: 3128750,
      emptyDate: '2025-01-09',
      salesEmployee: 'دعاء شدادي'
    },
    projectData: {
      constructionEndDate: '2024-09-28',
      finalDeliveryDate: '2024-08-28',
      electricityMeterDate: '',
      waterMeterDate: '',
      clientDeliveryDate: '2025-03-25'
    }
  },
  {
    id: '2',
    reservationNumber: '4',
    clientName: 'تركي السعيدي',
    project: 'المعالي',
    unit: '42',
    date: '2024-12-22',
    status: 'مكتملة بيانات المشروع وراحة العملاء',
  },
  {
    id: '3',
    reservationNumber: '5',
    clientName: 'علي بخاري',
    project: '',
    unit: 'رقم 45',
    date: '2024-01-01',
    status: 'مكتملة بيانات راحة العملاء',
  },
  {
    id: '4',
    reservationNumber: '6',
    clientName: 'ياسين الفار',
    project: '',
    unit: 'رقم 45',
    date: '2024-01-18',
    status: 'مكتملة بيانات راحة العملاء',
  }
];

const statusColors: Record<string, string> = {
  'مكتملة بيانات راحة العملاء': 'bg-blue-500/20 text-blue-500',
  'مكتملة بيانات المشروع وراحة العملاء': 'bg-green-500/20 text-green-500',
  'مكتملة': 'bg-green-500/20 text-green-500',
  'ناقصة': 'bg-yellow-500/20 text-yellow-500',
};

const Delivery = () => {
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isAddReservationDialogOpen, setIsAddReservationDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddReservation = (reservation: Partial<Reservation>) => {
    const newReservation: Reservation = {
      id: String(reservations.length + 1),
      reservationNumber: String(reservations.length + 1),
      clientName: reservation.clientName || '',
      project: reservation.project || '',
      unit: reservation.unit || '',
      date: new Date().toISOString().split('T')[0],
      status: 'ناقصة',
    };

    setReservations([...reservations, newReservation]);
    setIsAddReservationDialogOpen(false);
    toast({
      title: 'تم إضافة الحجز',
      description: `تم إضافة حجز جديد برقم ${newReservation.reservationNumber}`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">قسم الحجز</h1>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                استيراد من إكسيل
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>تحميل ملف إكسيل</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>استيراد بيانات</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isAddReservationDialogOpen} onOpenChange={setIsAddReservationDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                إضافة حجز جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>إضافة حجز جديد</DialogTitle>
              </DialogHeader>
              <ReservationForm 
                onSubmit={handleAddReservation} 
                onCancel={() => setIsAddReservationDialogOpen(false)} 
                btnText="إضافة الحجز"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-24">
              <SelectValue placeholder="الكل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="month">الشهر</SelectItem>
              <SelectItem value="year">السنة</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="بحث..." className="pl-3 pr-10 w-60" />
        </div>
      </div>

      <Card className="bg-card/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-4 font-medium">الرقم المتسلسل</th>
                <th className="text-right py-3 px-4 font-medium">تاريخ الحجز</th>
                <th className="text-right py-3 px-4 font-medium">اسم العميل</th>
                <th className="text-right py-3 px-4 font-medium">المشروع</th>
                <th className="text-right py-3 px-4 font-medium">الوحدة</th>
                <th className="text-right py-3 px-4 font-medium">حالة الحجز</th>
                <th className="text-right py-3 px-4 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="border-b border-border hover:bg-secondary/30">
                  <td className="py-3 px-4">{reservation.reservationNumber}</td>
                  <td className="py-3 px-4">{reservation.date}</td>
                  <td className="py-3 px-4">{reservation.clientName}</td>
                  <td className="py-3 px-4">{reservation.project}</td>
                  <td className="py-3 px-4">{reservation.unit}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${statusColors[reservation.status] || 'bg-gray-500/20 text-gray-500'}`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Reservation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الحجز</DialogTitle>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold">قسم المبيعات</h3>
                <Card className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">تاريخ الحجز</p>
                      <p className="font-medium">{selectedReservation.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">اسم العميل</p>
                      <p className="font-medium">{selectedReservation.clientName}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">المشروع</p>
                      <p className="font-medium">{selectedReservation.project}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">العمارة</p>
                      <p className="font-medium">{selectedReservation.unit}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">الوحدة</p>
                      <p className="font-medium">{selectedReservation.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">طريقة الدفع</p>
                      <p className="font-medium">{selectedReservation.salesData?.paymentMethod || 'بنك'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">نوع البيع</p>
                      <p className="font-medium">{selectedReservation.salesData?.saleType || 'جاهز'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">قيمة الوحدة</p>
                      <p className="font-medium">
                        {selectedReservation.salesData?.unitValue?.toLocaleString() || '3,128,750'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">تاريخ الإفراغ</p>
                      <p className="font-medium">{selectedReservation.salesData?.emptyDate || ''}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">موظف المبيعات</p>
                      <p className="font-medium">{selectedReservation.salesData?.salesEmployee || 'دعاء شدادي'}</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold">قسم المشاريع</h3>
                <Card className="p-4 space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">تاريخ انتهاء البناء</p>
                      <p className="font-medium">{selectedReservation.projectData?.constructionEndDate || ''}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">تاريخ الاستلام النهائي</p>
                      <p className="font-medium">{selectedReservation.projectData?.finalDeliveryDate || ''}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">تاريخ نقل عداد الكهرباء</p>
                      <p className="font-medium">{selectedReservation.projectData?.electricityMeterDate || ''}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">تاريخ نقل عداد المياه</p>
                      <p className="font-medium">{selectedReservation.projectData?.waterMeterDate || ''}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">تاريخ التسليم للعميل</p>
                      <p className="font-medium">{selectedReservation.projectData?.clientDeliveryDate || ''}</p>
                    </div>
                  </div>
                </Card>

                <div className="pt-4">
                  <h3 className="font-bold mb-3">تقييم راحة العملاء</h3>
                  <div>
                    <p className="text-sm mb-2">هل تم تقييم الاستلام؟</p>
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-md ${selectedReservation.satisfactionData?.hasBeenRated ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                        {selectedReservation.satisfactionData?.hasBeenRated ? 'نعم' : 'لا'}
                      </div>
                      
                      {selectedReservation.satisfactionData?.hasBeenRated && (
                        <div className="flex items-center gap-1">
                          <span>التقييم:</span>
                          <span className="font-bold">{selectedReservation.satisfactionData?.rating || 0}/10</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-6">
            <DialogClose asChild>
              <Button variant="outline">إغلاق</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Reservation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>تعديل الحجز</DialogTitle>
          </DialogHeader>
          
          {selectedReservation && (
            <div>
              <Tabs defaultValue="sales" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="sales">بيانات المبيعات</TabsTrigger>
                  <TabsTrigger value="project">بيانات المشاريع</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sales" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">تاريخ الحجز</label>
                      <Input
                        type="date"
                        defaultValue={selectedReservation.date || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">اسم العميل</label>
                      <Input defaultValue={selectedReservation.clientName || ''} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">المشروع</label>
                      <Input defaultValue={selectedReservation.project || ''} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">الوحدة</label>
                      <Input defaultValue={selectedReservation.unit || ''} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">طريقة الدفع</label>
                      <Select defaultValue={selectedReservation.salesData?.paymentMethod || 'bank'}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر طريقة الدفع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">بنك</SelectItem>
                          <SelectItem value="cash">نقدي</SelectItem>
                          <SelectItem value="installments">أقساط</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">نوع البيع</label>
                      <Select defaultValue={selectedReservation.salesData?.saleType || 'ready'}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع البيع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ready">جاهز</SelectItem>
                          <SelectItem value="under_construction">تحت الإنشاء</SelectItem>
                          <SelectItem value="custom">مخصص</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">قيمة الوحدة</label>
                      <Input 
                        defaultValue={selectedReservation.salesData?.unitValue?.toString() || ''}
                        type="number"
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">تاريخ الإفراغ</label>
                      <Input
                        type="date"
                        defaultValue={selectedReservation.salesData?.emptyDate || ''}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="project" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">تاريخ انتهاء البناء</label>
                      <Input
                        type="date"
                        defaultValue={selectedReservation.projectData?.constructionEndDate || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">تاريخ الاستلام النهائي</label>
                      <Input
                        type="date"
                        defaultValue={selectedReservation.projectData?.finalDeliveryDate || ''}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">تاريخ نقل عداد الكهرباء</label>
                      <Input
                        type="date"
                        defaultValue={selectedReservation.projectData?.electricityMeterDate || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">تاريخ نقل عداد المياه</label>
                      <Input
                        type="date"
                        defaultValue={selectedReservation.projectData?.waterMeterDate || ''}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">تاريخ التسليم للعميل</label>
                      <Input
                        type="date"
                        defaultValue={selectedReservation.projectData?.clientDeliveryDate || ''}
                      />
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4 mt-6">
                    <h3 className="font-bold mb-4">تقييم راحة العملاء</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">هل تم تقييم الاستلام</label>
                        <Select defaultValue={selectedReservation.satisfactionData?.hasBeenRated ? 'yes' : 'no'}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">نعم</SelectItem>
                            <SelectItem value="no">لا</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">تقييم عملية الاستلام (1-10)</label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          defaultValue={selectedReservation.satisfactionData?.rating || ''}
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={() => {
                  setIsEditDialogOpen(false);
                  toast({
                    title: 'تم حفظ التعديلات',
                    description: 'تم حفظ تعديلات الحجز بنجاح',
                  });
                }}>
                  حفظ التعديلات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ReservationFormProps {
  initialData?: Reservation;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  btnText: string;
}

const ReservationForm = ({ initialData, onSubmit, onCancel, btnText }: ReservationFormProps) => {
  const [formData, setFormData] = useState({
    clientName: initialData?.clientName || '',
    project: initialData?.project || '',
    unit: initialData?.unit || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="clientName" className="text-sm font-medium">
            اسم العميل
          </label>
          <Input
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="أدخل اسم العميل"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium">
            تاريخ الحجز
          </label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="project" className="text-sm font-medium">
            المشروع
          </label>
          <Input
            id="project"
            name="project"
            value={formData.project}
            onChange={handleChange}
            placeholder="أدخل اسم المشروع"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="unit" className="text-sm font-medium">
            الوحدة
          </label>
          <Input
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="أدخل رقم الوحدة"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit">
          {btnText}
        </Button>
      </div>
    </form>
  );
};

export default Delivery;
