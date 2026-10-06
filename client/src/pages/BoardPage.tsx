import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type BoardGame = {
  characters: string[]
  image: string
}

function characterImageSrc(name: string) {
  return `/images/characters/${name}.png`
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
    <main className="relative h-svh w-full cursor-crosshair overflow-hidden bg-[#1a2332]">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="pointer-events-auto shrink-0 cursor-pointer bg-black/40 px-3 text-white backdrop-blur-sm hover:bg-black/55 hover:text-white"
        >
          <Link to="/boards">← Boards</Link>
        </Button>

        {game && (
          <ul className="pointer-events-auto flex cursor-default items-center gap-3 sm:gap-4">
            {game.characters.map((name) => (
              <li key={name} className="flex flex-col items-center gap-1">
                <img
                  src={characterImageSrc(name)}
                  alt={name}
                  title={name}
                  className="h-16 w-16 rounded-full border-2 border-white/80 bg-white/90 object-contain p-0.5 shadow-md sm:h-20 sm:w-20"
                />
                <span className="rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm sm:text-xs">
                  {name}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="w-[5.5rem] shrink-0 sm:w-[6.5rem]" aria-hidden="true" />
      </header>

      {loading && (
        <p className="absolute inset-0 z-10 flex cursor-default items-center justify-center text-white/80">
          Loading board…
        </p>
      )}
      {error && (
        <p className="absolute inset-0 z-10 flex cursor-default items-center justify-center text-red-300">
          {error}
        </p>
      )}

      {game && (
        <div className="h-full w-full overflow-auto">
          <img
            src={game.image}
            alt="Game board"
            className="block h-auto w-full"
            draggable={false}
          />
        </div>
      )}
    </main>
  )
}
