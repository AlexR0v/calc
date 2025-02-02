import { useSupabaseClient }                from '@supabase/auth-helpers-react'
import { useCallback, useEffect, useState } from 'react'
import { toast }                            from 'react-toastify'
import { Database }                         from '../lib/schema.ts'
import { GeneralSettings }                  from '../types/types.ts'

export const useGetGeneralSettings = (activeKey: string) => {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({} as GeneralSettings)
  const [loadingGeneralSettings, setLoadingGeneralSettings] = useState(false)
  const supabase = useSupabaseClient<Database>()
  
  const fetchDirections = useCallback(async() => {
    setLoadingGeneralSettings(true)
    const { data, error } = await supabase
      .from('general')
      .select('*')
      .order('id', { ascending: true })
    if(error) {
      toast.error('Произошла ошибка')
      console.log('error', error)
      return
    }
    setGeneralSettings(data[0] as GeneralSettings)
    setLoadingGeneralSettings(false)
  }, [supabase])
  
  useEffect(() => {
    fetchDirections()
  }, [activeKey])
  
  return { generalSettings, loadingGeneralSettings, setGeneralSettings }
}
