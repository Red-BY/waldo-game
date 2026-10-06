import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BoardPage } from '@/pages/BoardPage'
import { BoardsPage } from '@/pages/BoardsPage'
import { HomePage } from '@/pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:boardId" element={<BoardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
