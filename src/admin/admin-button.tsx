import { LoginOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useSession, useSupabaseClient }               from '@supabase/auth-helpers-react'
import { FloatButton, Input, Modal, Tooltip }          from 'antd'
import { useState }                                    from 'react'
import { toast }                                       from 'react-toastify'

export const AdminButton = () => {
  
  const [openLogin, setOpenLogin] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const supabase = useSupabaseClient()
  const session = useSession()
  
  const onLogin = async() => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: login, password })
    if(error) {
      toast.error(error.message)
      setLoading(false)
      return
    }
    setLoading(false)
    setOpenLogin(false)
  }
  
  const onLogout = async() => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if(error) {
      toast.error(error.message)
      setLoading(false)
      return
    }
    setLoading(false)
    setOpenLogout(false)
    window.location.reload()
  }
  
  return (
    <div className='absolute top-5 right-5'>
      <FloatButton.Group
        trigger='hover'
        type='primary'
        style={{ insetInlineEnd: 94 }}
        icon={<UserOutlined />}
      >
        {!!session ? (
          <Tooltip title='Выйти'>
            <FloatButton
              onClick={() => setOpenLogout(true)}
              icon={<LogoutOutlined />}
            />
          </Tooltip>
        ) : (
          <Tooltip title='Войти'>
            <FloatButton
              onClick={() => setOpenLogin(true)}
              icon={<LoginOutlined />}
            />
          </Tooltip>
        )}
      </FloatButton.Group>
      <Modal
        title='Войти'
        centered
        open={openLogin}
        onOk={onLogin}
        onCancel={() => setOpenLogin(false)}
        loading={loading}
        okText='Войти'
        cancelText='Отмена'
      >
        <div className='flex flex-col gap-5'>
          <Input
            placeholder='Логин'
            value={login}
            onChange={e => setLogin(e.target.value)}
          />
          <Input.Password
            placeholder='Пароль'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      </Modal>
      <Modal
        title='Выход'
        centered
        open={openLogout}
        onOk={onLogout}
        onCancel={() => setOpenLogout(false)}
        loading={loading}
        okText='Выйти'
        cancelText='Отмена'
      >
        <p>Вы действительно хотите выйти?</p>
      </Modal>
    </div>
  )
}
