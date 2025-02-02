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
          price_cargo: string
          price_key: string
          price_int: string
        }
        Insert: {
          id?: string
          from_dir: string
          to_dir: string
          price_cargo: string
          price_key: string
          price_int: string
        }
        Update: {
          id?: string
          from_dir: string
          to_dir: string
          price_cargo: string
          price_key: string
          price_int: string
        }
      },
      services: {
        Row: {
          id: number
          name: string
          type: 'cargo' | 'key' | 'int'
          price: string
        }
        Insert: {
          id?: number
          name: string
          type: 'cargo' | 'key' | 'int'
          price: string
        }
        Update: {
          id?: number
          name: string
          type: 'cargo' | 'key' | 'int'
          price: string
        }
      },
      general: {
        Row: {
          id: number
          conversion: string
        }
        Insert: {
          id?: number
          conversion: string
        }
        Update: {
          id?: number
          conversion: string
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
