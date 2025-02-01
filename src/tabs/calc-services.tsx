import { Checkbox, GetProp, Skeleton } from 'antd'
import { Dispatch, SetStateAction }    from 'react'
import { useGetServices }              from '../hooks/useGetServices.tsx'

interface Props {
  setPriceServices: Dispatch<SetStateAction<number>>
}

export const CalcServices = ({setPriceServices}: Props) => {
  
  const { services, loadingServices } = useGetServices()
  
  const onChange: GetProp<typeof Checkbox.Group<number>, 'onChange'> = (checkedValues: number[]) => {
    setPriceServices(checkedValues.reduce((prev, next) => prev + next, 0))
  }
  
  return (
    <Skeleton
      loading={loadingServices}
      active
    >
      <div className='pt-5'>
        <Checkbox.Group
          options={services.map(item => ({ label: item.name, value: +item.price }))}
          onChange={onChange}
        />
      </div>
    </Skeleton>
  )
}
