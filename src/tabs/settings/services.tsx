import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useSupabaseClient }                 from '@supabase/auth-helpers-react'
import { Button, Form, Input, Skeleton }     from 'antd'
import { useState }                          from 'react'
import { toast }                             from 'react-toastify'
import { useGetServices }                    from '../../hooks/useGetServices.tsx'
import { Database }                          from '../../lib/schema.ts'
import { Services as ServicesType }          from '../../types/types.ts'

type TForm = {
  services: ServicesType[]
}

export const Services = () => {
  
  const [loading, setLoading] = useState(false)
  
  const {services, setServices, loadingServices} = useGetServices()
  
  const supabase = useSupabaseClient<Database>()
  
  const onFinish = async (values: TForm) => {
    setLoading(true)
    if(setServices.length){
      await supabase.from('services').delete().in('id', services.map(item => item.id)).throwOnError()
    }
    const { data, error } = await supabase
      .from('services')
      .upsert(values.services.map(item => ({ name: item.name, price: item.price })))
      .select('*')
      .order('id', { ascending: true })
    if(!error) toast.success('Успешно сохранено')
    if (error) {
      toast.error('Произошла ошибка')
      console.log('error', error)
    }
    setServices(data as ServicesType[])
    setLoading(false)
  }
  
  return(
    <Skeleton loading={loadingServices} active>
      <Form
        name="services"
        onFinish={onFinish}
        className='flex-1 border border-solid rounded-xl p-4 hover:shadow-lg hover:shadow-blue-500/50'
        autoComplete="off"
        layout="vertical"
        initialValues={{ services }}
      >
        <Form.List name="services">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className='flex w-full gap-4'>
                  <Form.Item
                    {...restField}
                    className='w-full'
                    label='Название услуги'
                    name={[name, 'name']}
                    rules={[{ required: true, message: 'Обязательное поле' }]}
                  >
                    <Input placeholder='Название' />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    className='w-full'
                    name={[name, 'price']}
                    label='Стоимость'
                    rules={[
                      { required: true, message: 'Обязательное поле' },
                      { type: 'number', message: 'Введите число', transform: (value) => Number(value) },
                    ]}
                  >
                    <Input placeholder='Стоимость' />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </div>
              ))}
              <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Добавить услугу
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" className='w-full' htmlType="submit" loading={loading}>
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </Skeleton>
  )
}
