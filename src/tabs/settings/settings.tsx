import { Collapse, CollapseProps } from 'antd'
import { Directions }              from './directions.tsx'
import { General }                 from './general.tsx'
import { Services }                from './services.tsx'

interface Props {
  activeKey: string
}

export const Settings = ({ activeKey }: Props) => {
  
  const items: CollapseProps['items'] = [
    {
      key: '0',
      label: 'Общие настройки',
      children: <General activeKey={activeKey} />,
    },
    {
      key: '1',
      label: 'Направления',
      children: <Directions activeKey={activeKey} />,
    },
    {
      key: '2',
      label: 'Дополнительные услуги',
      children: <Services activeKey={activeKey} />,
    },
  ]
  
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
