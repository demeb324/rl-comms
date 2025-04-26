import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './routes/Layout'
import LandingPage from './pages/LandingPage'
import PostPage from './pages/PostPage'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />  {/* Corrected route */}
      </Route>
    </Routes>
  )
}

export default App