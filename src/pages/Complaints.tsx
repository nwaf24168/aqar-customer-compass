
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
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Trash, 
  FileEdit, 
  Eye, 
  Plus, 
  Search, 
  ArrowDownUp, 
  Filter 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Complaint } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockComplaints: Complaint[] = [
  {
    id: '1',
    complaintNumber: '1001',
    clientName: 'أحمد العيباني',
    project: 'تل الرمال المالية',
    unit: '',
    status: 'تم حلها',
    source: 'الاستبيان',
    details: 'الشقة مصدر للصندوق ولم نتلق مبلغ الضريبة. تم التواصل مع الصندوق و رد الضريبة للعميل من قبلنا.',
    action: '',
    createdBy: 'عدنان',
    updatedBy: 'عدنان',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: '2',
    complaintNumber: '1002',
    clientName: 'راشد المحيا',
    project: '19',
    unit: '',
    status: 'تم حلها',
    source: '',
    details: '',
    action: '',
    createdBy: 'محمد',
    updatedBy: 'محمد',
    createdAt: '2025-02-27',
    updatedAt: '2025-02-27',
  },
  {
    id: '3',
    complaintNumber: '1003',
    clientName: 'نورة المسفر',
    project: 'المعالي',
    unit: '',
    status: 'تم حلها',
    source: '',
    details: '',
    action: '',
    createdBy: 'فاطمة',
    updatedBy: 'فاطمة',
    createdAt: '2025-01-26',
    updatedAt: '2025-01-26',
  },
  {
    id: '4',
    complaintNumber: '1004',
    clientName: 'حمد الحسين',
    project: 'النخيل',
    unit: '',
    status: 'فترات متابعة',
    source: '',
    details: '',
    action: '',
    createdBy: 'أحمد',
    updatedBy: 'أحمد',
    createdAt: '2025-01-28',
    updatedAt: '2025-01-28',
  },
  {
    id: '5',
    complaintNumber: '1005',
    clientName: 'تركي السعيد',
    project: 'المعالي',
    unit: '',
    status: 'تم حلها',
    source: '',
    details: '',
    action: '',
    createdBy: 'عبدالله',
    updatedBy: 'عبدالله',
    createdAt: '2025-02-17',
    updatedAt: '2025-02-17',
  },
];

const statusColors: Record<string, string> = {
  'تم حلها': 'bg-green-500/20 text-green-500',
  'قيد التنفيذ': 'bg-yellow-500/20 text-yellow-500',
  'ألغيت': 'bg-red-500/20 text-red-500',
  'فترات متابعة': 'bg-yellow-500/20 text-yellow-500',
};

const Complaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddComplaint = (complaint: Partial<Complaint>) => {
    const newComplaint: Complaint = {
      id: String(complaints.length + 1),
      complaintNumber: String(1000 + complaints.length + 1),
      clientName: complaint.clientName || '',
      project: complaint.project || '',
      unit: complaint.unit || '',
      status: complaint.status || 'قيد التنفيذ',
      source: complaint.source || '',
      details: complaint.details || '',
      action: complaint.action || '',
      createdBy: 'nawaf',
      updatedBy: 'nawaf',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setComplaints([...complaints, newComplaint]);
    setIsAddDialogOpen(false);
    toast({
      title: 'تم إضافة الشكوى',
      description: `تم إضافة شكوى جديدة برقم ${newComplaint.complaintNumber}`,
    });
  };

  const handleEditComplaint = (complaint: Complaint) => {
    const updatedComplaints = complaints.map(c => 
      c.id === complaint.id 
        ? { 
            ...complaint, 
            updatedBy: 'nawaf', // Set the current user as updater
            updatedAt: new Date().toISOString().split('T')[0] // Set current date
          } 
        : c
    );
    setComplaints(updatedComplaints);
    setIsEditDialogOpen(false);
    toast({
      title: 'تم تعديل الشكوى',
      description: `تم تعديل الشكوى رقم ${complaint.complaintNumber} بنجاح`,
    });
  };

  const handleDeleteComplaint = (id: string) => {
    setComplaints(complaints.filter(c => c.id !== id));
    toast({
      title: 'تم حذف الشكوى',
      description: 'تم حذف الشكوى بنجاح',
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">سجل الشكاوى</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              إضافة شكوى جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>إضافة شكوى جديدة</DialogTitle>
              <DialogDescription>أدخل تفاصيل الشكوى الجديدة</DialogDescription>
            </DialogHeader>
            <ComplaintForm 
              onSubmit={(data) => handleAddComplaint(data)} 
              onCancel={() => setIsAddDialogOpen(false)} 
              btnText="إضافة الشكوى"
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/50">
        <div className="p-4 flex items-center justify-between border-b border-border">
          <h2 className="text-xl font-medium">سجل الشكاوى والطلبات</h2>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="بحث عن عميل، مشروع أو شكوى..." 
                className="pl-3 pr-10 w-64" 
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>جميع الحالات</DropdownMenuItem>
                <DropdownMenuItem>تم حلها</DropdownMenuItem>
                <DropdownMenuItem>قيد التنفيذ</DropdownMenuItem>
                <DropdownMenuItem>ألغيت</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="icon">
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم الشكوى</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">اسم العميل</TableHead>
                <TableHead className="text-right">المشروع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id} className="hover:bg-secondary/30">
                  <TableCell>{complaint.complaintNumber}</TableCell>
                  <TableCell>{complaint.createdAt}</TableCell>
                  <TableCell>{complaint.clientName}</TableCell>
                  <TableCell>{complaint.project}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${statusColors[complaint.status] || 'bg-gray-500/20 text-gray-500'}`}>
                      {complaint.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>هل أنت متأكد من حذف هذه الشكوى؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              سيتم حذف الشكوى رقم {complaint.complaintNumber} نهائياً. هذا الإجراء لا يمكن التراجع عنه.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDeleteComplaint(complaint.id)}
                            >
                              نعم، حذف الشكوى
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* View Complaint Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>تفاصيل الشكوى #{selectedComplaint?.complaintNumber}</span>
              <div className={`inline-block px-3 py-1 rounded-full text-xs ${selectedComplaint?.status ? statusColors[selectedComplaint.status] : ''}`}>
                {selectedComplaint?.status}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedComplaint && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">معلومات العميل والمشروع</h3>
                  <Card className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-primary/20 text-primary">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">اسم العميل</p>
                        <p className="font-medium">{selectedComplaint.clientName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-primary/20 text-primary">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">المشروع</p>
                        <p className="font-medium">{selectedComplaint.project}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-primary/20 text-primary">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">رقم الوحدة</p>
                        <p className="font-medium">{selectedComplaint.unit || '-'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-primary/20 text-primary">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">مصدر الشكوى</p>
                        <p className="font-medium">{selectedComplaint.source || 'الاستبيان'}</p>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">معلومات الوقت والإنشاء</h3>
                  <Card className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-destructive/20 text-destructive">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">المدة</p>
                        <p className="font-medium">0 يوم</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-amber-500/20 text-amber-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
                        <p className="font-medium">{selectedComplaint.createdAt}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">تم الإنشاء بواسطة</p>
                        <p className="font-medium">{selectedComplaint.createdBy}</p>
                      </div>
                    </div>

                    {/* Add the updated information */}
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-blue-500/20 text-blue-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">تاريخ آخر تحديث</p>
                        <p className="font-medium">{selectedComplaint.updatedAt}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-purple-500/20 text-purple-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">تم التحديث بواسطة</p>
                        <p className="font-medium">{selectedComplaint.updatedBy}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">تفاصيل الشكوى</h3>
                  <Card className="p-4">
                    <p className="whitespace-pre-wrap">
                      {selectedComplaint.details || 'لا توجد تفاصيل مضافة.'}
                    </p>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">الإجراء المتخذ</h3>
                  <Card className="p-4">
                    <p className="whitespace-pre-wrap">
                      {selectedComplaint.action || 'لا توجد إجراءات مضافة.'}
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          )}
          
          <DialogClose asChild>
            <Button variant="outline" className="w-full mt-4">إغلاق</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Edit Complaint Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل الشكوى #{selectedComplaint?.complaintNumber}</DialogTitle>
            <DialogDescription>قم بتعديل تفاصيل الشكوى</DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <ComplaintForm 
              initialData={selectedComplaint}
              onSubmit={handleEditComplaint}
              onCancel={() => setIsEditDialogOpen(false)}
              btnText="حفظ التعديلات"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ComplaintFormProps {
  initialData?: Complaint;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  btnText: string;
}

const ComplaintForm = ({ initialData, onSubmit, onCancel, btnText }: ComplaintFormProps) => {
  const [formData, setFormData] = useState<Partial<Complaint>>(
    initialData || {
      clientName: '',
      project: '',
      unit: '',
      status: 'قيد التنفيذ',
      source: '',
      details: '',
      action: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
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
            value={formData.clientName || ''}
            onChange={handleChange}
            placeholder="أدخل اسم العميل"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium">
            التاريخ
          </label>
          <Input
            id="date"
            name="date"
            type="date"
            value={initialData?.createdAt || new Date().toISOString().split('T')[0]}
            readOnly={!!initialData}
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
            value={formData.project || ''}
            onChange={handleChange}
            placeholder="أدخل اسم المشروع"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="unit" className="text-sm font-medium">
            رقم الوحدة / العمارة
          </label>
          <Input
            id="unit"
            name="unit"
            value={formData.unit || ''}
            onChange={handleChange}
            placeholder="أدخل رقم الوحدة"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            الحالة
          </label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر حالة الشكوى" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="تم حلها">تم حلها</SelectItem>
              <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
              <SelectItem value="ألغيت">ألغيت</SelectItem>
              <SelectItem value="فترات متابعة">فترات متابعة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="source" className="text-sm font-medium">
            مصدر الشكوى
          </label>
          <Select
            value={formData.source || ''}
            onValueChange={(value) => handleSelectChange('source', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر مصدر الشكوى" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="الاستبيان">الاستبيان</SelectItem>
              <SelectItem value="اتصال مباشر">اتصال مباشر</SelectItem>
              <SelectItem value="البريد الإلكتروني">البريد الإلكتروني</SelectItem>
              <SelectItem value="الموقع الإلكتروني">الموقع الإلكتروني</SelectItem>
              <SelectItem value="وسائل التواصل">وسائل التواصل</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="details" className="text-sm font-medium">
          تفاصيل الشكوى
        </label>
        <Textarea
          id="details"
          name="details"
          value={formData.details || ''}
          onChange={handleChange}
          placeholder="أدخل تفاصيل الشكوى بشكل واضح ودقيق..."
          className="min-h-20"
        />
        <p className="text-xs text-muted-foreground">يرجى كتابة تفاصيل الشكوى بشكل واضح ودقيق.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="action" className="text-sm font-medium">
          الإجراء المتخذ (إن وجد)
        </label>
        <Textarea
          id="action"
          name="action"
          value={formData.action || ''}
          onChange={handleChange}
          placeholder="أدخل الإجراء المتخذ (إن وجد)..."
          className="min-h-20"
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-4">
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

export default Complaints;
