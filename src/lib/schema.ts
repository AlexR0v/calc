export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      directions: {
        Row: {
          id: string
          from_dir: string
          to_dir: string
          price_dir: string
        }
        Insert: {
          id?: string
          from_dir: string
          to_dir: string
          price_dir: string
        }
        Update: {
          id?: string
          from_dir: string
          to_dir: string
          price_dir: string
        }
      },
      services: {
        Row: {
          id: number
          name: string
          price: string
        }
        Insert: {
          id?: number
          name: string
          price: string
        }
        Update: {
          id?: number
          name: string
          price: string
        }
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
