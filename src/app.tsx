import { useSession }           from '@supabase/auth-helpers-react'
import { ConfigProvider, Tabs } from 'antd'
import ruRu                     from 'antd/locale/ru_RU'
import { useEffect, useState }  from 'react'
import { AdminButton }          from './admin/admin-button.tsx'
import { Calculator }           from './tabs/calculator.tsx'
import { Settings }             from './tabs/settings/settings.tsx'

export const App = () => {
  
  const session = useSession()
  
  const [items, setItems] = useState([
    {
      key: '1',
      label: 'Калькулятор',
      children: <Calculator />,
    },
  ])
  
  useEffect(() => {
    if(session?.user?.id === import.meta.env.VITE_ADMIN_ID) {
      setItems((prev) => {
        if(prev.length === 1) {
          return [
            ...prev,
            {
              key: '2',
              label: 'Настройки',
              children: <Settings />,
            },
          ]
        }
        return prev
      })
    }
    
  }, [session])
  
  return (
    <ConfigProvider
      locale={ruRu}
      theme={{
        token: {
          colorPrimary: '#008ad1',
        },
      }}
    >
      <div className='container mx-auto pt-3'>
        <Tabs
          centered
          defaultActiveKey='1'
          items={items}
        />
      </div>
      <AdminButton />
    </ConfigProvider>
  )
}
