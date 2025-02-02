import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useSupabaseClient }                 from '@supabase/auth-helpers-react'
import { Button, Form, Input, Skeleton }     from 'antd'
import { useState }                          from 'react'
import { toast }                             from 'react-toastify'
import { useGetDirections }                  from '../../hooks/useGetDirections.tsx'
import { Database }                          from '../../lib/schema.ts'
import { Directions as DirectionsType }      from '../../types/types.ts'

type TForm = {
  directions: DirectionsType[]
}

interface Props {
  activeKey: string
}

export const Directions = ({ activeKey }: Props) => {
  
  const [loading, setLoading] = useState(false)
  
  const { directions, setDirections, loadingDirections } = useGetDirections(activeKey)
  
  const supabase = useSupabaseClient<Database>()
  
  const onFinish = async(values: TForm) => {
    setLoading(true)
    if(directions.length) {
      await supabase.from('directions').delete().in('id', directions.map(item => item.id)).throwOnError()
    }
    const { data, error } = await supabase
      .from('directions')
      .upsert(values.directions.map(item => ({
        from_dir: item.from_dir,
        to_dir: item.to_dir,
        price_cargo: item.price_cargo,
        price_key: item.price_key,
        price_int: item.price_int,
      })))
      .select('*')
      .order('id', { ascending: true })
    if(!error) toast.success('Успешно сохранено')
    if(error) {
      toast.error('Произошла ошибка')
      console.log('error', error)
    }
    setDirections(data as DirectionsType[])
    setLoading(false)
  }
  
  return (
    <Skeleton
      loading={loadingDirections}
      active
    >
      <Form
        name='deliveries'
        onFinish={onFinish}
        className='flex-1'
        autoComplete='off'
        layout='vertical'
        initialValues={{ directions: directions }}
      >
        <Form.List name='directions'>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  className='flex gap-4 mb-4 border border-solid rounded-xl p-4 hover:shadow-lg hover:shadow-blue-500/50'
                >
                  <div className='flex flex-col 2xl:flex-row w-full md:gap-4'>
                    <div className='flex flex-col md:flex-row flex-1 md:gap-4'>
                      <Form.Item
                        {...restField}
                        className='w-full'
                        label='Откуда'
                        name={[name, 'from_dir']}
                        rules={[{ required: true, message: 'Обязательное поле' }]}
                      >
                        <Input placeholder='Откуда' />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label='Куда'
                        className='w-full'
                        name={[name, 'to_dir']}
                        rules={[{ required: true, message: 'Обязательное поле' }]}
                      >
                        <Input placeholder='Куда' />
                      </Form.Item>
                    </div>
                    <div className='flex flex-1 flex-col md:flex-row md:gap-4'>
                      <Form.Item
                        {...restField}
                        name={[name, 'price_cargo']}
                        label='Цена за 1 кг (Карго)'
                        className='w-full md:w-2/3'
                        rules={[
                          { required: true, message: 'Обязательное поле' },
                          { type: 'number', message: 'Введите число', transform: (value) => Number(value) },
                        ]}
                      >
                        <Input placeholder='Цена за 1 кг' />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'price_key']}
                        label='Цена за 1 кг (под ключ)'
                        className='w-full md:w-2/3'
                        rules={[
                          { required: true, message: 'Обязательное поле' },
                          { type: 'number', message: 'Введите число', transform: (value) => Number(value) },
                        ]}
                      >
                        <Input placeholder='Цена за 1 кг' />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'price_int']}
                        label='Цена за 1 кг (международ.)'
                        className='w-full md:w-2/3'
                        rules={[
                          { required: true, message: 'Обязательное поле' },
                          { type: 'number', message: 'Введите число', transform: (value) => Number(value) },
                        ]}
                      >
                        <Input placeholder='Цена за 1 кг' />
                      </Form.Item>
                    </div>
                  </div>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </div>
              ))}
              <div className='flex gap-4 w-full mt-4 xl:mt-0'>
                <Form.Item className='w-full'>
                  <Button
                    type='dashed'
                    block
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Добавить направление
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
