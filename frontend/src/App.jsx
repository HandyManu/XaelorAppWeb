import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/header/header.jsx'
import Footer from './components/footer/footer.jsx'
import Home from './pages/homePage.jsx'
import LogIn from './pages/LogIn.jsx'
function App() {

  //Here are the routes for the app
  return (
    <div>

      <Router>
        <Header />
        <div className='app-container'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<LogIn />} />
          </Routes>
        </div>
        <Footer />
      </Router>

    </div>
  )
}

export default App
