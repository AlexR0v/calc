import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createRoot }             from 'react-dom/client'
import './index.css'
import { Bounce, ToastContainer } from 'react-toastify'
import { App }                    from './app.tsx'
import { supabase }               from './lib/initSupabase.ts'

createRoot(document.getElementById('root')!).render(
  <SessionContextProvider supabaseClient={supabase}>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      theme="colored"
      transition={Bounce}
    />
  </SessionContextProvider>,
)
