import { Directions } from './directions.tsx'
import { Services }   from './services.tsx'

export const Settings = () => {
  
  return (
    <div className='flex gap-10 pt-10'>
      <Directions />
      <Services />
    </div>
  )
}
