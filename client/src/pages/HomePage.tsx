import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function HomePage() {
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
        <img
          src="/waldo-logo.png"
          alt="Where's Waldo?"
          className="animate-logo-pop mb-6 w-full max-w-sm drop-shadow-md sm:max-w-md"
        />

        <p
          className="animate-fade-up mt-2 max-w-sm text-base leading-relaxed text-[#3D5270] sm:text-lg"
          style={{ animationDelay: '200ms' }}
        >
          Scan the crowd and find given characters as fast as possible.
        </p>

        <div className="animate-fade-up mt-8" style={{ animationDelay: '360ms' }}>
          <Button
            asChild
            size="lg"
            className="h-12 min-w-40 px-8 text-base font-semibold shadow-md transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            <Link to="/boards">Play</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
