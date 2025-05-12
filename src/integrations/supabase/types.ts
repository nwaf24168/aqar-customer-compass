export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_data: {
        Row: {
          call_complaints: number
          call_contact_requests: number
          call_guest_appointments: number
          call_inquiries: number
          call_maintenance_requests: number
          call_office_appointments: number
          call_project_appointments: number
          created_at: string
          created_by: string
          customer_satisfaction_closing_time: number
          customer_satisfaction_first_time_resolution: number
          customer_satisfaction_service_quality: number
          date: string
          id: string
          nps_after_year: number
          nps_new_clients: number
          nps_old_clients: number
          period: string
        }
        Insert: {
          call_complaints: number
          call_contact_requests: number
          call_guest_appointments: number
          call_inquiries: number
          call_maintenance_requests: number
          call_office_appointments: number
          call_project_appointments: number
          created_at?: string
          created_by: string
          customer_satisfaction_closing_time: number
          customer_satisfaction_first_time_resolution: number
          customer_satisfaction_service_quality: number
          date: string
          id?: string
          nps_after_year: number
          nps_new_clients: number
          nps_old_clients: number
          period: string
        }
        Update: {
          call_complaints?: number
          call_contact_requests?: number
          call_guest_appointments?: number
          call_inquiries?: number
          call_maintenance_requests?: number
          call_office_appointments?: number
          call_project_appointments?: number
          created_at?: string
          created_by?: string
          customer_satisfaction_closing_time?: number
          customer_satisfaction_first_time_resolution?: number
          customer_satisfaction_service_quality?: number
          date?: string
          id?: string
          nps_after_year?: number
          nps_new_clients?: number
          nps_old_clients?: number
          period?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          action: string | null
          client_name: string
          complaint_number: string
          created_at: string
          created_by: string
          details: string | null
          id: string
          project: string
          source: string
          status: string
          unit: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          action?: string | null
          client_name: string
          complaint_number: string
          created_at?: string
          created_by: string
          details?: string | null
          id?: string
          project: string
          source: string
          status: string
          unit: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          action?: string | null
          client_name?: string
          complaint_number?: string
          created_at?: string
          created_by?: string
          details?: string | null
          id?: string
          project?: string
          source?: string
          status?: string
          unit?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      customer_satisfaction: {
        Row: {
          closing_time_bad: number
          closing_time_good: number
          closing_time_neutral: number
          closing_time_very_bad: number
          closing_time_very_good: number
          comments: string | null
          created_at: string
          created_by: string
          date: string
          first_time_resolution_bad: number
          first_time_resolution_good: number
          first_time_resolution_neutral: number
          first_time_resolution_very_bad: number
          first_time_resolution_very_good: number
          id: string
          period: string
          service_quality_bad: number
          service_quality_good: number
          service_quality_neutral: number
          service_quality_very_bad: number
          service_quality_very_good: number
        }
        Insert: {
          closing_time_bad: number
          closing_time_good: number
          closing_time_neutral: number
          closing_time_very_bad: number
          closing_time_very_good: number
          comments?: string | null
          created_at?: string
          created_by: string
          date: string
          first_time_resolution_bad: number
          first_time_resolution_good: number
          first_time_resolution_neutral: number
          first_time_resolution_very_bad: number
          first_time_resolution_very_good: number
          id?: string
          period: string
          service_quality_bad: number
          service_quality_good: number
          service_quality_neutral: number
          service_quality_very_bad: number
          service_quality_very_good: number
        }
        Update: {
          closing_time_bad?: number
          closing_time_good?: number
          closing_time_neutral?: number
          closing_time_very_bad?: number
          closing_time_very_good?: number
          comments?: string | null
          created_at?: string
          created_by?: string
          date?: string
          first_time_resolution_bad?: number
          first_time_resolution_good?: number
          first_time_resolution_neutral?: number
          first_time_resolution_very_bad?: number
          first_time_resolution_very_good?: number
          id?: string
          period?: string
          service_quality_bad?: number
          service_quality_good?: number
          service_quality_neutral?: number
          service_quality_very_bad?: number
          service_quality_very_good?: number
        }
        Relationships: []
      }
      metrics: {
        Row: {
          achieved: boolean
          category: string
          change: number
          created_at: string
          created_by: string
          date: string
          goal: number
          id: string
          name: string
          period: string
          value: number
        }
        Insert: {
          achieved: boolean
          category: string
          change: number
          created_at?: string
          created_by: string
          date: string
          goal: number
          id?: string
          name: string
          period: string
          value: number
        }
        Update: {
          achieved?: boolean
          category?: string
          change?: number
          created_at?: string
          created_by?: string
          date?: string
          goal?: number
          id?: string
          name?: string
          period?: string
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          role: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          client_delivery_date: string | null
          client_name: string
          construction_end_date: string | null
          created_at: string
          created_by: string
          date: string
          electricity_meter_date: string | null
          empty_date: string | null
          final_delivery_date: string | null
          has_been_rated: boolean | null
          id: string
          payment_method: string | null
          project: string
          rating: number | null
          reservation_number: string
          sale_type: string | null
          sales_employee: string | null
          status: string
          unit: string
          unit_value: number | null
          updated_at: string
          water_meter_date: string | null
        }
        Insert: {
          client_delivery_date?: string | null
          client_name: string
          construction_end_date?: string | null
          created_at?: string
          created_by: string
          date: string
          electricity_meter_date?: string | null
          empty_date?: string | null
          final_delivery_date?: string | null
          has_been_rated?: boolean | null
          id?: string
          payment_method?: string | null
          project: string
          rating?: number | null
          reservation_number: string
          sale_type?: string | null
          sales_employee?: string | null
          status: string
          unit: string
          unit_value?: number | null
          updated_at?: string
          water_meter_date?: string | null
        }
        Update: {
          client_delivery_date?: string | null
          client_name?: string
          construction_end_date?: string | null
          created_at?: string
          created_by?: string
          date?: string
          electricity_meter_date?: string | null
          empty_date?: string | null
          final_delivery_date?: string | null
          has_been_rated?: boolean | null
          id?: string
          payment_method?: string | null
          project?: string
          rating?: number | null
          reservation_number?: string
          sale_type?: string | null
          sales_employee?: string | null
          status?: string
          unit?: string
          unit_value?: number | null
          updated_at?: string
          water_meter_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
