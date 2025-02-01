import { InputNumber, Select, Skeleton } from 'antd'
import { useEffect, useState }           from 'react'
import { toast }                         from 'react-toastify'
import { useGetDirections }              from '../hooks/useGetDirections.tsx'
import { CalcServices }                  from './calc-services.tsx'

type SummProps = {
  priceDirection: number
  priceServices: number
  volume: number | null
  weight: number | null
}

const summ = ({ priceDirection, priceServices, volume, weight }: SummProps) => {
  let result = 0
  if(weight) {
    result += priceDirection * weight
  }
  if(volume) {
    result += volume * 10
  }
  
  return result + priceServices
}

export const Calculator = () => {
  
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [priceDirection, setPriceDirection] = useState(0)
  const [volume, setVolume] = useState<number | null>(0)
  const [weight, setWeight] = useState<number | null>(0)
  const [priceServices, setPriceServices] = useState(0)
  const [error, setError] = useState('')
  
  const { directions, uniqueDirections, loadingDirections } = useGetDirections()
  
  useEffect(() => {
    
    const direction = directions.find(item => item.from_dir === from && item.to_dir === to)
    
    if(direction) {
      setPriceDirection(+direction.price_dir)
      setError('')
    }
    if(!direction && from && to) {
      setPriceDirection(0)
      setError('Нет такого направления')
    }
    
  }, [from, to])
  
  useEffect(() => {
    if(error) {
      toast.error(error)
    }
  }, [error])
  
  return (
    <div className='mx-auto mt-10 max-w-[600px] border border-solid rounded-xl p-4 shadow-lg shadow-blue-500/50'>
      <Skeleton
        loading={loadingDirections}
        active
      >
        <div className='flex gap-6'>
          <div className='flex flex-col w-full'>
            <span>Откуда</span>
            <Select
              className='w-full'
              value={from}
              onChange={setFrom}
              options={uniqueDirections.map(item => ({
                value: item,
                label: item,
              }))}
            />
          </div>
          <div className='flex flex-col w-full'>
            <span>Куда</span>
            <Select
              className='w-full'
              value={to}
              onChange={setTo}
              options={uniqueDirections.map(item => ({
                value: item,
                label: item,
              }))}
            />
          </div>
        </div>
        <div className='flex gap-6 pt-5'>
          <div className='flex flex-col w-full'>
            <span>Вес, кг.</span>
            <InputNumber
              className='w-[100px]'
              value={weight}
              onChange={setWeight}
            />
          </div>
          <div className='flex flex-col w-full'>
            <span>Объем, м3</span>
            <InputNumber
              className='w-[100px]'
              value={volume}
              onChange={setVolume}
            />
          </div>
        </div>
        <CalcServices setPriceServices={setPriceServices} />
        <div className='pt-5 font-bold'>
          <span>Итоговая цена: {weight && priceDirection ? summ({ priceDirection, priceServices, volume, weight }) + ' руб.' : ''}</span>
        </div>
      </Skeleton>
    </div>
)
}
