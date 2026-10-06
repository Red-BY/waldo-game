import { Link, useParams } from 'react-router-dom'
import { useEffect, useRef, useState, type AnimationEvent, type MouseEvent } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type BoardGame = {
  characters: string[]
  image: string
}

type MenuPosition = {
  x: number
  y: number
}

type MarkerState = {
  id: number
  position: MenuPosition
  closing: boolean
}

const MENU_DISMISS_DISTANCE = 80

function characterImageSrc(name: string) {
  return `/images/characters/${name}.png`
}

function distanceToRect(clientX: number, clientY: number, rect: DOMRect) {
  const dx = Math.max(rect.left - clientX, 0, clientX - rect.right)
  const dy = Math.max(rect.top - clientY, 0, clientY - rect.bottom)
  return Math.hypot(dx, dy)
}

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const [game, setGame] = useState<BoardGame | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [marker, setMarker] = useState<MarkerState | null>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)
  const markerIdRef = useRef(0)

  const menuOpen = marker !== null && !marker.closing

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

  useEffect(() => {
    if (!menuOpen) return

    function closeMenu() {
      setMarker((current) =>
        current && !current.closing ? { ...current, closing: true } : current,
      )
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (imageContainerRef.current?.contains(target)) return
      closeMenu()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeMenu()
    }

    function handlePointerMove(event: PointerEvent) {
      const markerEl = markerRef.current
      if (!markerEl) return

      const menuEl = markerEl.querySelector('[role="menu"]')
      const distance = Math.min(
        distanceToRect(event.clientX, event.clientY, markerEl.getBoundingClientRect()),
        menuEl
          ? distanceToRect(event.clientX, event.clientY, menuEl.getBoundingClientRect())
          : Infinity,
      )

      if (distance > MENU_DISMISS_DISTANCE) closeMenu()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointermove', handlePointerMove)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointermove', handlePointerMove)
    }
  }, [menuOpen])

  function openMenu(position: MenuPosition) {
    markerIdRef.current += 1
    setMarker({
      id: markerIdRef.current,
      position,
      closing: false,
    })
  }

  function closeMenu() {
    setMarker((current) =>
      current && !current.closing ? { ...current, closing: true } : current,
    )
  }

  function handleImageClick(event: MouseEvent<HTMLImageElement>) {
    const container = imageContainerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    openMenu({
      x: event.clientX - rect.left + container.scrollLeft,
      y: event.clientY - rect.top + container.scrollTop,
    })
  }

  function handleCharacterSelect() {
    closeMenu()
  }

  function handleMarkerAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.animationName !== 'marker-out') return
    setMarker((current) => (current?.closing ? null : current))
  }

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
        <div ref={imageContainerRef} className="relative h-full w-full overflow-auto">
          <img
            src={game.image}
            alt="Game board"
            className="block h-auto w-full"
            draggable={false}
            onClick={handleImageClick}
          />

          {marker && (
            <div
              key={marker.id}
              ref={markerRef}
              className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2"
              style={{ left: marker.position.x, top: marker.position.y }}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className={cn('relative', marker.closing && 'animate-marker-out')}
                onAnimationEnd={handleMarkerAnimationEnd}
              >
                <div
                  className="animate-target-pop relative size-10"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 animate-target-pulse rounded-full border-2 border-white/50" />
                  <div className="size-10 rounded-full border-2 border-white bg-black/40 shadow-md backdrop-blur-sm" />
                </div>

                <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2">
                  <div
                    role="menu"
                    aria-label="Select character"
                    className={cn(
                      'min-w-36 overflow-hidden rounded-md border border-white/20 bg-black/40 shadow-lg backdrop-blur-sm',
                      marker.closing ? 'animate-menu-out' : 'animate-menu-in',
                      menuOpen ? 'pointer-events-auto' : 'pointer-events-none',
                    )}
                  >
                    {game.characters.map((name) => (
                      <button
                        key={name}
                        type="button"
                        role="menuitem"
                        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-white hover:bg-white/15"
                        onClick={handleCharacterSelect}
                      >
                        <img
                          src={characterImageSrc(name)}
                          alt=""
                          className="h-6 w-6 rounded-full bg-white/90 object-contain"
                        />
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
