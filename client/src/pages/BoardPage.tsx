import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type BoardGame = {
  characters: string[]
  image: string
}

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const [game, setGame] = useState<BoardGame | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadBoard() {
      if (!boardId) {
        setError('Invalid board')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/game/${boardId}`)
        if (!response.ok) {
          throw new Error('Failed to load board')
        }
        const data = (await response.json()) as BoardGame
        if (!cancelled) {
          setGame(data)
          setError(null)
        }
      } catch {
        if (!cancelled) {
          setError('Could not load this board.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadBoard()
    return () => {
      cancelled = true
    }
  }, [boardId])

  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden px-6 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.95 0.04 230 / 0.95), oklch(0.93 0.03 225 / 0.98) 70%)',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Button asChild variant="ghost" size="sm" className="w-fit px-0 text-[#3D5270]">
          <Link to="/boards">← Boards</Link>
        </Button>

        {loading && <p className="text-[#3D5270]">Loading board…</p>}
        {error && <p className="text-destructive">{error}</p>}

        {game && (
          <>
            <p className="text-base text-[#3D5270]">
              Find: {game.characters.join(', ')}
            </p>
            <img
              src={game.image}
              alt="Game board"
              className="w-full rounded-lg shadow-md"
            />
          </>
        )}
      </div>
    </main>
  )
}
