import { useSupabaseClient }   from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { toast }               from 'react-toastify'
import { Database }            from '../lib/schema.ts'
import { Services }            from '../types/types.ts'

export const useGetServices = () => {
  const [services, setServices] = useState<Services[]>([])
  const [loadingServices, setLoadingServices] = useState(false)
  const supabase = useSupabaseClient<Database>()
  
  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true)
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true })
      if (error) {
        toast.error('Произошла ошибка')
        console.log('error', error)
        return
      }
      setServices(data)
      setLoadingServices(false)
    }
    
    fetchServices()
  }, [supabase])
  
  return { services, loadingServices, setServices }
}
