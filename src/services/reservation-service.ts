
import { supabase } from '@/integrations/supabase/client';
import { Reservation } from '@/types';

export const fetchReservations = async (): Promise<Reservation[]> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      reservationNumber: item.reservation_number,
      clientName: item.client_name,
      project: item.project,
      unit: item.unit,
      date: item.date,
      status: item.status,
      salesData: {
        paymentMethod: item.payment_method || '',
        saleType: item.sale_type || '',
        unitValue: item.unit_value || 0,
        emptyDate: item.empty_date || '',
        salesEmployee: item.sales_employee || ''
      },
      projectData: {
        constructionEndDate: item.construction_end_date || '',
        finalDeliveryDate: item.final_delivery_date || '',
        electricityMeterDate: item.electricity_meter_date || '',
        waterMeterDate: item.water_meter_date || '',
        clientDeliveryDate: item.client_delivery_date || ''
      },
      satisfactionData: {
        hasBeenRated: item.has_been_rated || false,
        rating: item.rating || 0
      }
    }));
  } catch (error) {
    console.error('Error in fetchReservations:', error);
    return [];
  }
};

export const addReservation = async (reservation: Partial<Reservation>): Promise<Reservation | null> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      console.error('No authenticated user found');
      return null;
    }
    
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        reservation_number: reservation.reservationNumber,
        client_name: reservation.clientName,
        project: reservation.project,
        unit: reservation.unit,
        date: reservation.date || new Date().toISOString().split('T')[0],
        status: reservation.status || 'جديد',
        payment_method: reservation.salesData?.paymentMethod,
        sale_type: reservation.salesData?.saleType,
        unit_value: reservation.salesData?.unitValue,
        empty_date: reservation.salesData?.emptyDate,
        sales_employee: reservation.salesData?.salesEmployee,
        construction_end_date: reservation.projectData?.constructionEndDate,
        final_delivery_date: reservation.projectData?.finalDeliveryDate,
        electricity_meter_date: reservation.projectData?.electricityMeterDate,
        water_meter_date: reservation.projectData?.waterMeterDate,
        client_delivery_date: reservation.projectData?.clientDeliveryDate,
        has_been_rated: reservation.satisfactionData?.hasBeenRated || false,
        rating: reservation.satisfactionData?.rating,
        created_by: userId
      })
      .select();
    
    if (error) {
      console.error('Error adding reservation:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data returned after insert');
    }
    
    const newReservation = data[0];
    return {
      id: newReservation.id,
      reservationNumber: newReservation.reservation_number,
      clientName: newReservation.client_name,
      project: newReservation.project,
      unit: newReservation.unit,
      date: newReservation.date,
      status: newReservation.status,
      salesData: {
        paymentMethod: newReservation.payment_method || '',
        saleType: newReservation.sale_type || '',
        unitValue: newReservation.unit_value || 0,
        emptyDate: newReservation.empty_date || '',
        salesEmployee: newReservation.sales_employee || ''
      },
      projectData: {
        constructionEndDate: newReservation.construction_end_date || '',
        finalDeliveryDate: newReservation.final_delivery_date || '',
        electricityMeterDate: newReservation.electricity_meter_date || '',
        waterMeterDate: newReservation.water_meter_date || '',
        clientDeliveryDate: newReservation.client_delivery_date || ''
      },
      satisfactionData: {
        hasBeenRated: newReservation.has_been_rated || false,
        rating: newReservation.rating || 0
      }
    };
  } catch (error) {
    console.error('Error in addReservation:', error);
    return null;
  }
};

export const updateReservation = async (reservation: Partial<Reservation> & { id: string }): Promise<Reservation | null> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .update({
        reservation_number: reservation.reservationNumber,
        client_name: reservation.clientName,
        project: reservation.project,
        unit: reservation.unit,
        date: reservation.date,
        status: reservation.status,
        payment_method: reservation.salesData?.paymentMethod,
        sale_type: reservation.salesData?.saleType,
        unit_value: reservation.salesData?.unitValue,
        empty_date: reservation.salesData?.emptyDate,
        sales_employee: reservation.salesData?.salesEmployee,
        construction_end_date: reservation.projectData?.constructionEndDate,
        final_delivery_date: reservation.projectData?.finalDeliveryDate,
        electricity_meter_date: reservation.projectData?.electricityMeterDate,
        water_meter_date: reservation.projectData?.waterMeterDate,
        client_delivery_date: reservation.projectData?.clientDeliveryDate,
        has_been_rated: reservation.satisfactionData?.hasBeenRated,
        rating: reservation.satisfactionData?.rating,
        updated_at: new Date().toISOString()
      })
      .eq('id', reservation.id)
      .select();
    
    if (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data returned after update');
    }
    
    const updatedReservation = data[0];
    return {
      id: updatedReservation.id,
      reservationNumber: updatedReservation.reservation_number,
      clientName: updatedReservation.client_name,
      project: updatedReservation.project,
      unit: updatedReservation.unit,
      date: updatedReservation.date,
      status: updatedReservation.status,
      salesData: {
        paymentMethod: updatedReservation.payment_method || '',
        saleType: updatedReservation.sale_type || '',
        unitValue: updatedReservation.unit_value || 0,
        emptyDate: updatedReservation.empty_date || '',
        salesEmployee: updatedReservation.sales_employee || ''
      },
      projectData: {
        constructionEndDate: updatedReservation.construction_end_date || '',
        finalDeliveryDate: updatedReservation.final_delivery_date || '',
        electricityMeterDate: updatedReservation.electricity_meter_date || '',
        waterMeterDate: updatedReservation.water_meter_date || '',
        clientDeliveryDate: updatedReservation.client_delivery_date || ''
      },
      satisfactionData: {
        hasBeenRated: updatedReservation.has_been_rated || false,
        rating: updatedReservation.rating || 0
      }
    };
  } catch (error) {
    console.error('Error in updateReservation:', error);
    return null;
  }
};

export const deleteReservation = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteReservation:', error);
    return false;
  }
};
