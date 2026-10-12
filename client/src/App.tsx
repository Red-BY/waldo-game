import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BoardPage } from '@/pages/BoardPage'
import { HomePage } from '@/pages/HomePage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'
import { VictoryPage } from '@/pages/VictoryPage'

/** Temporary: only Space is playable; board select is hidden. */
const DEFAULT_BOARD_ID = 2

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/boards"
          element={<Navigate to={`/boards/${DEFAULT_BOARD_ID}`} replace />}
        />
        <Route path="/boards/:boardId" element={<BoardPage />} />
        <Route path="/boards/:boardId/victory" element={<VictoryPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
