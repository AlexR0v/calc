import { Checkbox, GetProp, Skeleton } from 'antd'
import { Dispatch, SetStateAction }    from 'react'
import { useGetServices }              from '../hooks/useGetServices.tsx'

interface Props {
  setPriceServicesCargo: Dispatch<SetStateAction<number>>
  setPriceServicesKey: Dispatch<SetStateAction<number>>
  setPriceServicesInt: Dispatch<SetStateAction<number>>
}

export const CalcServices = ({ setPriceServicesCargo, setPriceServicesKey, setPriceServicesInt }: Props) => {
  
  const { services, loadingServices } = useGetServices()
  
  const onChangeCargo: GetProp<typeof Checkbox.Group<number>, 'onChange'> = (checkedValues: number[]) => {
    setPriceServicesCargo(checkedValues.reduce((prev, next) => prev + next, 0))
  }
  
  const onChangeKey: GetProp<typeof Checkbox.Group<number>, 'onChange'> = (checkedValues: number[]) => {
    setPriceServicesKey(checkedValues.reduce((prev, next) => prev + next, 0))
  }
  
  const onChangeInt: GetProp<typeof Checkbox.Group<number>, 'onChange'> = (checkedValues: number[]) => {
    setPriceServicesInt(checkedValues.reduce((prev, next) => prev + next, 0))
  }
  
  return (
    <Skeleton
      loading={loadingServices}
      active
    >
      <div className='flex flex-wrap gap-4 justify-between'>
        <div className='pt-5'>
          <div>Карго</div>
          <Checkbox.Group
            options={services.filter(item => item.type === 'cargo').map(item => ({ label: item.name, value: +item.price }))}
            onChange={onChangeCargo}
          />
        </div>
        <div className='pt-5'>
          <div>Под ключ</div>
          <Checkbox.Group
            options={services.filter(item => item.type === 'key').map(item => ({ label: item.name, value: +item.price }))}
            onChange={onChangeKey}
          />
        </div>
        <div className='pt-5'>
          <div>Международная</div>
          <Checkbox.Group
            options={services.filter(item => item.type === 'int').map(item => ({ label: item.name, value: +item.price }))}
            onChange={onChangeInt}
          />
        </div>
      </div>
    </Skeleton>
  )
}
