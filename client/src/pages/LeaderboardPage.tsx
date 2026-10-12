import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

type ScoreEntry = {
  id: number
  playerName: string
  score: number
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function LeaderboardPage() {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadScores() {
      try {
        const response = await fetch('/api/scores')
        if (!response.ok) {
          throw new Error('Failed to load scores')
        }
        const data: unknown = await response.json()
        if (!cancelled) {
          setScores(Array.isArray(data) ? (data as ScoreEntry[]) : [])
          setError(null)
        }
      } catch {
        if (!cancelled) {
          setError('Could not load scores. Is the server running?')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadScores()
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
              Leaderboard
            </h1>
            <p className="mt-2 text-base text-[#3D5270]">
              Fastest completion times, best to worst.
            </p>
          </div>
        </header>

        {loading && (
          <p className="animate-fade-up text-[#3D5270]" style={{ animationDelay: '120ms' }}>
            Loading scores…
          </p>
        )}

        {error && (
          <p className="animate-fade-up text-destructive" style={{ animationDelay: '120ms' }}>
            {error}
          </p>
        )}

        {!loading && !error && scores.length === 0 && (
          <p className="animate-fade-up text-[#3D5270]" style={{ animationDelay: '120ms' }}>
            No scores yet. Finish a board to claim the top spot.
          </p>
        )}

        {!loading && !error && scores.length > 0 && (
          <div
            className="animate-fade-up overflow-x-auto"
            style={{ animationDelay: '120ms' }}
          >
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#1E3A5F]/20 text-sm font-semibold uppercase tracking-wide text-[#3D5270]">
                  <th className="pb-3 pr-4 font-semibold">#</th>
                  <th className="pb-3 pr-4 font-semibold">Player</th>
                  <th className="pb-3 text-right font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[#1E3A5F]/10 text-[#1E3A5F]"
                  >
                    <td className="py-3 pr-4 font-mono tabular-nums text-[#3D5270]">
                      {index + 1}
                    </td>
                    <td className="py-3 pr-4 font-medium">{entry.playerName}</td>
                    <td className="py-3 text-right font-mono tabular-nums">
                      <time dateTime={`PT${Math.floor(entry.score / 1000)}S`}>
                        {formatElapsed(entry.score)}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
