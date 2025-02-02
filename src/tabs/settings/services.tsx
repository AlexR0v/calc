import { MinusCircleOutlined, PlusOutlined }     from '@ant-design/icons'
import { useSupabaseClient }                     from '@supabase/auth-helpers-react'
import { Button, Form, Input, Select, Skeleton } from 'antd'
import { useState }                              from 'react'
import { toast }                                 from 'react-toastify'
import { useGetServices }                        from '../../hooks/useGetServices.tsx'
import { Database }                              from '../../lib/schema.ts'
import { Services as ServicesType }              from '../../types/types.ts'

const { Option } = Select

type TForm = {
  services: ServicesType[]
}

interface Props {
  activeKey: string
}

export const Services = ({ activeKey }: Props) => {
  
  const [loading, setLoading] = useState(false)
  
  const { services, setServices, loadingServices } = useGetServices(activeKey)
  
  const supabase = useSupabaseClient<Database>()
  
  const onFinish = async(values: TForm) => {
    setLoading(true)
    if(setServices.length) {
      await supabase.from('services').delete().in('id', services.map(item => item.id)).throwOnError()
    }
    const { data, error } = await supabase
      .from('services')
      .upsert(values.services.map(item => ({
        name: item.name,
        price: item.price,
        type: item.type,
      })))
      .select('*')
      .order('id', { ascending: true })
    if(!error) toast.success('Успешно сохранено')
    if(error) {
      toast.error('Произошла ошибка')
      console.log('error', error)
    }
    setServices(data as ServicesType[])
    setLoading(false)
  }
  
  return (
    <Skeleton
      loading={loadingServices}
      active
    >
      <Form
        name='services'
        onFinish={onFinish}
        className='flex-1'
        autoComplete='off'
        layout='vertical'
        initialValues={{ services }}
      >
        <Form.List name='services'>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  className='flex gap-4 mb-4 border border-solid rounded-xl p-2 hover:shadow hover:shadow-blue-500/50'
                >
                  <div
                    className='flex flex-col md:flex-row w-full md:gap-4'
                  >
                    <Form.Item
                      {...restField}
                      className='w-full'
                      label='Название доп. услуги'
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Обязательное поле' }]}
                    >
                      <Input placeholder='Название' />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      className='w-full'
                      label='Yслуга'
                      name={[name, 'type']}
                      rules={[{ required: true, message: 'Обязательное поле' }]}
                    >
                      <Select
                        placeholder='Выберите услугу'
                      >
                        <Option value='cargo'>Карго</Option>
                        <Option value='key'>Под ключ</Option>
                        <Option value='int'>Международная</Option>
                      </Select>
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
                  </div>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </div>
              ))}
              <div className='flex gap-4 w-full'>
                <Form.Item className='w-full'>
                  <Button
                    type='dashed'
                    block
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Добавить услугу
                  </Button>
                </Form.Item>
                <Form.Item className='w-full'>
                  <Button
                    type='primary'
                    block
                    htmlType='submit'
                    loading={loading}
                  >
                    Сохранить
                  </Button>
                </Form.Item>
              </div>
            </>
          )}
        </Form.List>
      </Form>
    </Skeleton>
  )
}
