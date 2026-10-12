import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function VictoryPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const [elapsedMs, setElapsedMs] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [playerName, setPlayerName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadCompletionTime() {
      if (!boardId) {
        setError('Invalid board')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/game/${boardId}/complete`, {
          method: 'POST',
          credentials: 'include',
        })
        if (!response.ok) {
          throw new Error('Failed to load completion time')
        }
        const data = (await response.json()) as { elapsedMs: number }
        if (!cancelled) {
          setElapsedMs(data.elapsedMs)
          setError(null)
        }
      } catch {
        if (!cancelled) {
          setError('Could not load your completion time.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadCompletionTime()
    return () => {
      cancelled = true
    }
  }, [boardId])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (elapsedMs === null || submitting || submitted) return

    const name = playerName.trim()
    if (!name) {
      setSubmitError('Please enter a player name.')
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score: elapsedMs }),
      })
      if (!response.ok) {
        throw new Error('Failed to record score')
      }
      setSubmitted(true)
    } catch {
      setSubmitError('Could not record your result. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden="true"
        className="animate-stripe-drift pointer-events-none absolute inset-0 opacity-[0.12]"
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
            'radial-gradient(ellipse 80% 60% at 50% 35%, oklch(0.95 0.04 230 / 0.95), oklch(0.9 0.05 220 / 0.7) 50%, oklch(0.93 0.03 225 / 0.98) 100%)',
        }}
      />

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        <h1
          className="animate-fade-up text-4xl font-semibold tracking-tight text-[#1E3A5F] sm:text-5xl"
        >
          Congratulations!
        </h1>

        {loading && (
          <p
            className="animate-fade-up mt-8 text-[#3D5270]"
            style={{ animationDelay: '200ms' }}
          >
            Loading your time…
          </p>
        )}

        {error && (
          <p
            className="animate-fade-up mt-8 text-destructive"
            style={{ animationDelay: '200ms' }}
          >
            {error}
          </p>
        )}

        {!loading && !error && elapsedMs !== null && (
          <div
            className="animate-fade-up mt-8 flex flex-col items-center"
            style={{ animationDelay: '200ms' }}
          >
            <p className="text-base text-[#3D5270] sm:text-lg">
              Your completion time:
            </p>
            <p
              className="mt-2 font-mono text-3xl font-medium tabular-nums tracking-wide text-[#1E3A5F] sm:text-4xl"
              aria-live="polite"
            >
              <time dateTime={`PT${Math.floor(elapsedMs / 1000)}S`}>
                {formatElapsed(elapsedMs)}
              </time>
            </p>

            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex w-full max-w-xs flex-col items-center gap-3"
              >
                <p className="text-base text-[#3D5270] sm:text-lg">
                  Record your result?
                </p>
                <input
                  type="text"
                  name="playerName"
                  autoComplete="nickname"
                  placeholder="Player Name"
                  aria-label="Player Name"
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                  disabled={submitting}
                  className="h-10 w-full rounded-lg border border-input bg-white/80 px-3 text-base text-[#1E3A5F] outline-none placeholder:text-[#3D5270]/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                />
                {submitError && (
                  <p className="text-sm text-destructive" role="alert">
                    {submitError}
                  </p>
                )}
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="h-12 w-56 px-8 text-base font-semibold shadow-md transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  {submitting ? 'Submitting…' : 'Submit'}
                </Button>
              </form>
            ) : (
              <p className="mt-8 text-base text-[#3D5270]" role="status">
                Result recorded. You can find your score on the leaderboard!
              </p>
            )}
          </div>
        )}

        <div className="animate-fade-up mt-10" style={{ animationDelay: '360ms' }}>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 w-56 bg-white/60 px-8 text-base font-semibold shadow-md transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            <Link to="/">Return to main menu</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
