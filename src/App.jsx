import { useState } from 'react'
import AuthScreen from './components/AuthScreen.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'

export default function App() {
  const [user, setUser] = useState(null)

  if (!user) {
    return <AuthScreen onLogin={setUser} />
  }

  return <DashboardLayout user={user} onLogout={() => setUser(null)} />
}
