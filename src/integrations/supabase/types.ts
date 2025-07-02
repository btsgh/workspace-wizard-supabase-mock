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
      applications: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      bugs: {
        Row: {
          assigned_developer: string | null
          created_at: string | null
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["bug_priority"] | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["bug_status"] | null
          title: string
        }
        Insert: {
          assigned_developer?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["bug_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["bug_status"] | null
          title: string
        }
        Update: {
          assigned_developer?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["bug_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["bug_status"] | null
          title?: string
        }
        Relationships: []
      }
      customer_meetings: {
        Row: {
          created_at: string | null
          customer_name: string
          id: string
          meeting_date: string | null
          meeting_type: string | null
          notes: string | null
        }
        Insert: {
          created_at?: string | null
          customer_name: string
          id?: string
          meeting_date?: string | null
          meeting_type?: string | null
          notes?: string | null
        }
        Update: {
          created_at?: string | null
          customer_name?: string
          id?: string
          meeting_date?: string | null
          meeting_type?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          company: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          contract_value: number | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          status: string | null
        }
        Insert: {
          company?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          contract_value?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: string | null
        }
        Update: {
          company?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          contract_value?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      developer_efficiency: {
        Row: {
          avg_resolution_time_hours: number | null
          bugs_resolved: number | null
          created_at: string | null
          developer_name: string
          efficiency_score: number | null
          id: string
          month_year: string
        }
        Insert: {
          avg_resolution_time_hours?: number | null
          bugs_resolved?: number | null
          created_at?: string | null
          developer_name: string
          efficiency_score?: number | null
          id?: string
          month_year: string
        }
        Update: {
          avg_resolution_time_hours?: number | null
          bugs_resolved?: number | null
          created_at?: string | null
          developer_name?: string
          efficiency_score?: number | null
          id?: string
          month_year?: string
        }
        Relationships: []
      }
      employee_performance_new: {
        Row: {
          created_at: string | null
          employee_id: string | null
          feedback: string | null
          goals_achieved: number | null
          id: string
          performance_rating:
            | Database["public"]["Enums"]["employee_performance"]
            | null
          review_period: string
          reviewer: string | null
          total_goals: number | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          feedback?: string | null
          goals_achieved?: number | null
          id?: string
          performance_rating?:
            | Database["public"]["Enums"]["employee_performance"]
            | null
          review_period: string
          reviewer?: string | null
          total_goals?: number | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          feedback?: string | null
          goals_achieved?: number | null
          id?: string
          performance_rating?:
            | Database["public"]["Enums"]["employee_performance"]
            | null
          review_period?: string
          reviewer?: string | null
          total_goals?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_performance_new_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string | null
          department: string | null
          email: string | null
          employee_id: string
          full_name: string
          hire_date: string | null
          id: string
          manager: string | null
          position: string | null
          salary: number | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          employee_id: string
          full_name: string
          hire_date?: string | null
          id?: string
          manager?: string | null
          position?: string | null
          salary?: number | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string | null
          employee_id?: string
          full_name?: string
          hire_date?: string | null
          id?: string
          manager?: string | null
          position?: string | null
          salary?: number | null
        }
        Relationships: []
      }
      features: {
        Row: {
          assigned_developer: string | null
          created_at: string | null
          description: string | null
          estimated_hours: number | null
          id: string
          priority: Database["public"]["Enums"]["bug_priority"] | null
          status: string | null
          title: string
        }
        Insert: {
          assigned_developer?: string | null
          created_at?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: Database["public"]["Enums"]["bug_priority"] | null
          status?: string | null
          title: string
        }
        Update: {
          assigned_developer?: string | null
          created_at?: string | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: Database["public"]["Enums"]["bug_priority"] | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      launch_strategies: {
        Row: {
          budget: number | null
          created_at: string | null
          id: string
          launch_date: string | null
          product_name: string
          strategy_details: string | null
          target_market: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          id?: string
          launch_date?: string | null
          product_name: string
          strategy_details?: string | null
          target_market?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          id?: string
          launch_date?: string | null
          product_name?: string
          strategy_details?: string | null
          target_market?: string | null
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approved_by: string | null
          created_at: string | null
          days_requested: number | null
          employee_id: string | null
          end_date: string | null
          id: string
          leave_type: string
          reason: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["leave_status"] | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          days_requested?: number | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          leave_type: string
          reason?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["leave_status"] | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          days_requested?: number | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          leave_type?: string
          reason?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["leave_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          application_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          page_order: number | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          page_order?: number | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          page_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      user_workspace_access: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_workspace_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_workspace_access_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["workspace_type"]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          type: Database["public"]["Enums"]["workspace_type"]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["workspace_type"]
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
      bug_priority: "low" | "medium" | "high" | "critical"
      bug_status: "open" | "in_progress" | "resolved" | "closed"
      employee_performance:
        | "excellent"
        | "good"
        | "average"
        | "needs_improvement"
      leave_status: "pending" | "approved" | "rejected"
      user_role: "admin" | "developer" | "sales" | "hr"
      workspace_type: "developer" | "sales" | "hris"
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
    Enums: {
      bug_priority: ["low", "medium", "high", "critical"],
      bug_status: ["open", "in_progress", "resolved", "closed"],
      employee_performance: [
        "excellent",
        "good",
        "average",
        "needs_improvement",
      ],
      leave_status: ["pending", "approved", "rejected"],
      user_role: ["admin", "developer", "sales", "hr"],
      workspace_type: ["developer", "sales", "hris"],
    },
  },
} as const
