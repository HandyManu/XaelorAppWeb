import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Home from './pages/homePage'
import LogIn from './pages/LogIn'
function App() {

  //Here are the routes for the app
  return (
    <>
      <Router>
        <Nav/>
        <div className='app-container'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<LogIn/>}/>
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
