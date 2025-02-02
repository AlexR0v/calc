import { Collapse, CollapseProps } from 'antd'
import { Directions }              from './directions.tsx'
import { General }                 from './general.tsx'
import { Services }                from './services.tsx'

const items: CollapseProps['items'] = [
  {
    key: '0',
    label: 'Общие настройки',
    children: <General />,
  },
  {
    key: '1',
    label: 'Направления',
    children: <Directions />,
  },
  {
    key: '2',
    label: 'Дополнительные услуги',
    children: <Services />,
  },
]

export const Settings = () => {
  
  return (
    <div className='flex flex-col gap-10 pt-10'>
      <Collapse
        ghost
        items={items}
        defaultActiveKey={['1, 0']}
      />
    </div>
  )
}
