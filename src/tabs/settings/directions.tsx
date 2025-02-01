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

export const Directions = () => {
  
  const [loading, setLoading] = useState(false)
  
  const {directions, setDirections, loadingDirections} = useGetDirections()
  
  const supabase = useSupabaseClient<Database>()
  
  const onFinish = async (values: TForm) => {
    setLoading(true)
    if(directions.length){
      await supabase.from('directions').delete().in('id', directions.map(item => item.id)).throwOnError()
    }
    const { data, error } = await supabase
      .from('directions')
      .upsert(values.directions.map(item => ({ from_dir: item.from_dir, to_dir: item.to_dir, price_dir: item.price_dir })))
      .select('*')
      .order('id', { ascending: true })
    if(!error) toast.success('Успешно сохранено')
    if (error) {
      toast.error('Произошла ошибка')
      console.log('error', error)
    }
    setDirections(data as DirectionsType[])
    setLoading(false)
  }
  
  return(
    <Skeleton loading={loadingDirections} active>
      <Form
        name="deliveries"
        onFinish={onFinish}
        className='flex-1 border border-solid rounded-xl p-4 hover:shadow-lg hover:shadow-blue-500/50'
        autoComplete="off"
        layout="vertical"
        initialValues={{ directions: directions }}
      >
        <Form.List name="directions">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className='flex w-full gap-4' >
                  <Form.Item
                    {...restField}
                    className='w-full'
                    label="Откуда"
                    name={[name, 'from_dir']}
                    rules={[{ required: true, message: 'Обязательное поле' }]}
                  >
                    <Input placeholder="Откуда" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Куда"
                    className='w-full'
                    name={[name, 'to_dir']}
                    rules={[{ required: true, message: 'Обязательное поле' }]}
                  >
                    <Input placeholder="Куда" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'price_dir']}
                    label="Цена за 1 кг"
                    className='w-full'
                    rules={[
                      { required: true, message: 'Обязательное поле' },
                      { type: 'number', message: 'Введите число', transform: (value) => Number(value) },
                    ]}
                  >
                    <Input placeholder="Цена за 1 кг" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Добавить направление
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
