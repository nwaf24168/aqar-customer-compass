
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager' | 'customer_service' | 'maintenance';
  createdAt: string;
}

export interface Metric {
  id: string;
  period: 'weekly' | 'yearly';
  date: string;
  category: string;
  name: string;
  value: number;
  goal: number;
  change: number;
  achieved: boolean;
  createdBy: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  clientName: string;
  project: string;
  unit: string;
  status: 'تم حلها' | 'قيد التنفيذ' | 'ألغيت' | 'فترات متابعة';
  source: string;
  details: string;
  action: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  clientName: string;
  project: string;
  unit: string;
  date: string;
  status: string;
  salesData?: {
    paymentMethod?: string;
    saleType?: string;
    unitValue?: number;
    emptyDate?: string;
    salesEmployee?: string;
  };
  projectData?: {
    constructionEndDate?: string;
    finalDeliveryDate?: string;
    electricityMeterDate?: string;
    waterMeterDate?: string;
    clientDeliveryDate?: string;
  };
  satisfactionData?: {
    hasBeenRated?: boolean;
    rating?: number;
  };
}

export interface CustomerSatisfaction {
  id: string;
  period: 'weekly' | 'yearly';
  date: string;
  serviceQuality: {
    veryGood: number;
    good: number;
    neutral: number;
    bad: number;
    veryBad: number;
  };
  closingTime: {
    veryGood: number;
    good: number;
    neutral: number;
    bad: number;
    veryBad: number;
  };
  firstTimeResolution: {
    veryGood: number;
    good: number;
    neutral: number;
    bad: number;
    veryBad: number;
  };
  comments: string;
}

export interface AnalyticsData {
  nps: {
    newClients: number;
    afterYear: number;
    oldClients: number;
  };
  callDistribution: {
    complaints: number;
    contactRequests: number;
    maintenanceRequests: number;
    inquiries: number;
    officeAppointments: number;
    projectAppointments: number;
    guestAppointments: number;
  };
  customerSatisfaction: {
    serviceQuality: number;
    closingTime: number;
    firstTimeResolution: number;
  };
}
