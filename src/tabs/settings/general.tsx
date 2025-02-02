import { useSupabaseClient }             from '@supabase/auth-helpers-react'
import { Button, Form, Input, Skeleton } from 'antd'
import { useState }                      from 'react'
import { toast }                         from 'react-toastify'
import { useGetGeneralSettings }         from '../../hooks/useGetGeneralSettings.tsx'
import { Database }                      from '../../lib/schema.ts'
import { GeneralSettings }               from '../../types/types.ts'

type TForm = {
  general: GeneralSettings
}

interface Props {
  activeKey: string
}

export const General = ({ activeKey }: Props) => {
  
  const [loading, setLoading] = useState(false)
  
  const { generalSettings, setGeneralSettings, loadingGeneralSettings } = useGetGeneralSettings(activeKey)
  
  const supabase = useSupabaseClient<Database>()
  
  const onFinish = async(values: TForm) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('general')
      .update(values)
      .match({ id: generalSettings.id })
      .select('*')
      .order('id', { ascending: true })
    if(!error) toast.success('Успешно сохранено')
    if(error) {
      toast.error('Произошла ошибка')
      console.log('error', error)
    }
    if(data) {
      setGeneralSettings(data[0] as GeneralSettings)
    }
    setLoading(false)
  }
  
  return (
    <Skeleton
      loading={loadingGeneralSettings}
      active
    >
      <Form
        name='general'
        onFinish={onFinish}
        className='flex-1'
        autoComplete='off'
        layout='vertical'
        initialValues={{
          conversion: generalSettings.conversion,
        }}
      >
        <div className='flex flex-col 2xl:flex-row w-full md:gap-4'>
          <div className='flex flex-col md:flex-row flex-1 md:gap-4'>
            <Form.Item
              className='w-[100px]]'
              label='Конвертация веса к объему'
              name='conversion'
              rules={[
                { required: true, message: 'Обязательное поле' },
                { type: 'number', message: 'Введите число', transform: (value) => Number(value) },
              ]}
            >
              <Input placeholder='Конверсия' />
            </Form.Item>
          </div>
        </div>
        <div className='flex gap-4 w-full mt-4 xl:mt-0'>
          <Form.Item className='w-full'>
            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
            >
              Сохранить
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Skeleton>
  )
}
