import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

type Board = {
  id: number
  name: string
}

export function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadBoards() {
      try {
        const response = await fetch('/boards')
        if (!response.ok) {
          throw new Error('Failed to load boards')
        }
        const data: unknown = await response.json()
        if (!cancelled) {
          setBoards(Array.isArray(data) ? (data as Board[]) : [])
          setError(null)
        }
      } catch {
        if (!cancelled) {
          setError('Could not load boards. Is the server running?')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadBoards()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden px-6 py-12">
      <div
        aria-hidden="true"
        className="animate-stripe-drift pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #E11D2E 0 12px, #FFFFFF 12px 24px)',
          backgroundSize: '48px 100%',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.95 0.04 230 / 0.95), oklch(0.93 0.03 225 / 0.98) 70%)',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col gap-8">
        <header className="animate-fade-up flex flex-col gap-4">
          <Button asChild variant="ghost" size="sm" className="w-fit px-0 text-[#3D5270]">
            <Link to="/">← Back</Link>
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#1E3A5F]">
              Choose a board
            </h1>
            <p className="mt-2 text-base text-[#3D5270]">
              Pick a scene and start searching.
            </p>
          </div>
        </header>

        {loading && (
          <p className="animate-fade-up text-[#3D5270]" style={{ animationDelay: '120ms' }}>
            Loading boards…
          </p>
        )}

        {error && (
          <p className="animate-fade-up text-destructive" style={{ animationDelay: '120ms' }}>
            {error}
          </p>
        )}

        {!loading && !error && boards.length === 0 && (
          <p className="animate-fade-up text-[#3D5270]" style={{ animationDelay: '120ms' }}>
            No boards available yet.
          </p>
        )}

        {!loading && !error && boards.length > 0 && (
          <ul className="flex flex-col gap-3">
            {boards.map((board, index) => (
              <li
                key={board.id}
                className="animate-fade-up"
                style={{ animationDelay: `${120 + index * 60}ms` }}
              >
                <Button
                  asChild
                  size="lg"
                  className="h-12 w-full px-8 text-base font-semibold shadow-md transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Link to={`/boards/${board.id}`}>{board.name}</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
