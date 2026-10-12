import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BoardPage } from '@/pages/BoardPage'
import { BoardsPage } from '@/pages/BoardsPage'
import { HomePage } from '@/pages/HomePage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'
import { VictoryPage } from '@/pages/VictoryPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:boardId" element={<BoardPage />} />
        <Route path="/boards/:boardId/victory" element={<VictoryPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
