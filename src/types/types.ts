import { Database } from '../lib/schema.ts'

export type Directions = Database['public']['Tables']['directions']['Row']
export type Services = Database['public']['Tables']['services']['Row']
