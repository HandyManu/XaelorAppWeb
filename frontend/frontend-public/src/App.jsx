import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' // Importar AuthProvider
import Navegation from './components/Navegation'

function App() {
  return (
    <AuthProvider> {/* Envolver todo con AuthProvider */}
      <Router>
        <Navegation />
      </Router>
    </AuthProvider>
  );
}

export default App;