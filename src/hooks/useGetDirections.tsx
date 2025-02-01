import { useSupabaseClient }   from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { toast }               from 'react-toastify'
import { Database }            from '../lib/schema.ts'
import { Directions }          from '../types/types.ts'

export const useGetDirections = () => {
  const [directions, setDirections] = useState<Directions[]>([])
  const [uniqueDirections, setUnique] = useState<string[]>([])
  const [loadingDirections, setLoadingAll] = useState(false)
  const supabase = useSupabaseClient<Database>()
  
  useEffect(() => {
    const fetchDirections = async () => {
      setLoadingAll(true)
      const { data, error } = await supabase
        .from('directions')
        .select('*')
        .order('id', { ascending: true })
      if (error) {
        toast.error('Произошла ошибка')
        console.log('error', error)
        return
      }
      setDirections(data)
      if(data?.length){
        const unique = [...new Set([...data.map(item => item.from_dir), ...data.map(item => item.to_dir)])]
        setUnique(unique)
      }
      setLoadingAll(false)
    }
    
    fetchDirections()
  }, [supabase])
  
  return { directions, loadingDirections, setDirections, uniqueDirections }
}
