import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Footer from './components/footer'
import Header from './components/header'
import Home from './pages/homePage'
function App() {

  //Here are the routes for the app
  return (
    <>
      <Router>
        <Header/>
        <div className='app-container'>
          <Routes>
            <Route path='/' element={<Home/>}/>
          </Routes>
        </div>
        <Footer/>
      </Router>
    </>
  )
}

export default App
