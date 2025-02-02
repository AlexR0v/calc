import { InputNumber, Select, Skeleton } from 'antd'
import { useEffect, useState }           from 'react'
import { useGetDirections }              from '../hooks/useGetDirections.tsx'
import { useGetGeneralSettings }         from '../hooks/useGetGeneralSettings.tsx'
import { CalcServices }                  from './calc-services.tsx'

const CONVERSION_FACTOR = 150


type SummProps = {
  priceDirection: number
  priceServices: number
  volume: number | null
  weight: number | null
  conversion: number
}

const summ = ({ priceDirection, priceServices, volume, weight, conversion }: SummProps) => {
  let weightVolume = weight ?? 0
  
  if(volume) {
    weightVolume = volume * conversion > weightVolume ? volume * conversion : weightVolume
  }
  
  return priceDirection * weightVolume + priceServices
}

export const Calculator = () => {
  
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [priceDirCargo, setPriceDirCargo] = useState(0)
  const [priceDirKey, setPriceDirKey] = useState(0)
  const [priceDirInt, setPriceDirInt] = useState(0)
  const [volume, setVolume] = useState<number | null>(0)
  const [weight, setWeight] = useState<number | null>(0)
  const [priceServicesCargo, setPriceServicesCargo] = useState(0)
  const [priceServicesKey, setPriceServicesKey] = useState(0)
  const [priceServicesInt, setPriceServicesInt] = useState(0)
  const [error, setError] = useState('')
  const [errorWeight, setErrorWeight] = useState('')
  
  const { directions, uniqueDirections, loadingDirections } = useGetDirections()
  const { generalSettings, loadingGeneralSettings } = useGetGeneralSettings()
  
  useEffect(() => {
    
    const direction = directions.find(item => item.from_dir === from && item.to_dir === to)
    
    if(direction) {
      setPriceDirCargo(+direction.price_cargo)
      setPriceDirKey(+direction.price_key)
      setPriceDirInt(+direction.price_int)
      setError('')
    }
    if(!direction && from && to) {
      setPriceDirCargo(0)
      setError('Нет такого направления')
    }
    
  }, [from, to])
  
  useEffect(() => {
    if(volume && weight && volume * CONVERSION_FACTOR < weight) {
      setErrorWeight('Тяжелый груз')
    } else {
      setErrorWeight('')
    }
  }, [weight, volume])
  
  return (
    <div className='mx-auto mt-10 max-w-[600px] border border-solid rounded-xl p-4 shadow-lg shadow-blue-500/50'>
      <Skeleton
        loading={loadingDirections || loadingGeneralSettings}
        active
      >
        <div className='flex flex-col sm:flex-row gap-6'>
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
        <CalcServices
          setPriceServicesCargo={setPriceServicesCargo}
          setPriceServicesInt={setPriceServicesInt}
          setPriceServicesKey={setPriceServicesKey}
        />
        <div className='pt-5'>
          <span className='font-bold mr-2'>Итоговая цена:</span>
          {error && <span className='text-red-500'>{error}</span>}
          {errorWeight && <span className='text-red-500'>{errorWeight}</span>}
          <div className='flex flex-col gap-2 mt-2'>
            <span>{(weight || volume) && priceDirCargo ? 'Карго: ' +
              summ({ priceDirection: priceDirCargo, priceServices: priceServicesCargo, volume, weight, conversion: +generalSettings.conversion }) +
              ' руб.' : ''}</span>
            <span>{(weight || volume) && priceDirKey ? 'Под ключ: ' +
              summ({ priceDirection: priceDirKey, priceServices: priceServicesKey, volume, weight, conversion: +generalSettings.conversion }) +
              ' руб.' : ''}</span>
            <span>{(weight || volume) && priceDirInt ? 'Междунароная: ' +
              summ({ priceDirection: priceDirInt, priceServices: priceServicesInt, volume, weight, conversion: +generalSettings.conversion }) +
              ' руб.' : ''}</span>
          </div>
        </div>
      </Skeleton>
    </div>
  )
}
