
import { supabase } from '@/integrations/supabase/client';
import { Complaint } from '@/types';

export const fetchComplaints = async (): Promise<Complaint[]> => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      complaintNumber: item.complaint_number,
      clientName: item.client_name,
      project: item.project,
      unit: item.unit,
      status: item.status as Complaint['status'],
      source: item.source,
      details: item.details || '',
      action: item.action || '',
      createdBy: item.created_by,
      updatedBy: item.updated_by || item.created_by,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  } catch (error) {
    console.error('Error in fetchComplaints:', error);
    return [];
  }
};

export const addComplaint = async (complaint: Omit<Complaint, 'id' | 'createdBy' | 'updatedBy' | 'createdAt' | 'updatedAt'>): Promise<Complaint | null> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      console.error('No authenticated user found');
      return null;
    }
    
    const { data, error } = await supabase
      .from('complaints')
      .insert({
        complaint_number: complaint.complaintNumber,
        client_name: complaint.clientName,
        project: complaint.project,
        unit: complaint.unit,
        status: complaint.status,
        source: complaint.source,
        details: complaint.details,
        action: complaint.action,
        created_by: userId,
        updated_by: userId
      })
      .select();
    
    if (error) {
      console.error('Error adding complaint:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data returned after insert');
    }
    
    const newComplaint = data[0];
    return {
      id: newComplaint.id,
      complaintNumber: newComplaint.complaint_number,
      clientName: newComplaint.client_name,
      project: newComplaint.project,
      unit: newComplaint.unit,
      status: newComplaint.status as Complaint['status'],
      source: newComplaint.source,
      details: newComplaint.details || '',
      action: newComplaint.action || '',
      createdBy: newComplaint.created_by,
      updatedBy: newComplaint.updated_by || newComplaint.created_by,
      createdAt: newComplaint.created_at,
      updatedAt: newComplaint.updated_at
    };
  } catch (error) {
    console.error('Error in addComplaint:', error);
    return null;
  }
};

export const updateComplaint = async (complaint: Partial<Complaint> & { id: string }): Promise<Complaint | null> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      console.error('No authenticated user found');
      return null;
    }
    
    const updateData: any = {
      updated_by: userId
    };
    
    // إضافة الحقول المحدثة فقط
    if (complaint.complaintNumber !== undefined) updateData.complaint_number = complaint.complaintNumber;
    if (complaint.clientName !== undefined) updateData.client_name = complaint.clientName;
    if (complaint.project !== undefined) updateData.project = complaint.project;
    if (complaint.unit !== undefined) updateData.unit = complaint.unit;
    if (complaint.status !== undefined) updateData.status = complaint.status;
    if (complaint.source !== undefined) updateData.source = complaint.source;
    if (complaint.details !== undefined) updateData.details = complaint.details;
    if (complaint.action !== undefined) updateData.action = complaint.action;
    
    const { data, error } = await supabase
      .from('complaints')
      .update(updateData)
      .eq('id', complaint.id)
      .select();
    
    if (error) {
      console.error('Error updating complaint:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data returned after update');
    }
    
    const updatedComplaint = data[0];
    return {
      id: updatedComplaint.id,
      complaintNumber: updatedComplaint.complaint_number,
      clientName: updatedComplaint.client_name,
      project: updatedComplaint.project,
      unit: updatedComplaint.unit,
      status: updatedComplaint.status as Complaint['status'],
      source: updatedComplaint.source,
      details: updatedComplaint.details || '',
      action: updatedComplaint.action || '',
      createdBy: updatedComplaint.created_by,
      updatedBy: updatedComplaint.updated_by,
      createdAt: updatedComplaint.created_at,
      updatedAt: updatedComplaint.updated_at
    };
  } catch (error) {
    console.error('Error in updateComplaint:', error);
    return null;
  }
};

export const deleteComplaint = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting complaint:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteComplaint:', error);
    return false;
  }
};
