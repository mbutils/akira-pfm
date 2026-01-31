import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Import dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
