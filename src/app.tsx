import { useSession }           from '@supabase/auth-helpers-react'
import { ConfigProvider, Tabs } from 'antd'
import ruRu                     from 'antd/locale/ru_RU'
import { useState }             from 'react'
import { AdminButton }          from './admin/admin-button.tsx'
import { Calculator }           from './tabs/calculator.tsx'
import { Settings }             from './tabs/settings/settings.tsx'

export const App = () => {
  
  const [activeKey, setActiveKey] = useState('1')
  
  const session = useSession()
  
  const items = [
    {
      key: '1',
      label: 'Калькулятор',
      children: <Calculator activeKey={activeKey} />,
    },
    {
      key: '2',
      label: 'Настройки',
      children: <Settings activeKey={activeKey} />,
    },
  ]
  
  return (
    <ConfigProvider
      locale={ruRu}
      theme={{
        token: {
          colorPrimary: '#008ad1',
        },
      }}
    >
      <div className='container mx-auto pt-3 h-full'>
        <Tabs
          centered
          activeKey={activeKey}
          defaultActiveKey={activeKey}
          items={session?.user?.id === import.meta.env.VITE_ADMIN_ID ? items : items.slice(0, 1)}
          onChange={(key) => setActiveKey(() => key)}
        />
      </div>
      <AdminButton />
    </ConfigProvider>
  )
}
