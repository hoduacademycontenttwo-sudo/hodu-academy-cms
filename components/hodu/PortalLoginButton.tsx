'use client'

interface PortalLoginButtonProps {
  className?: string
  compact?: boolean
}

export default function PortalLoginButton({ className = '', compact = false }: PortalLoginButtonProps) {
  return (
    <a
      href="https://portal.hoduacademy.com/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Student & Parent Portal Log In"
      title="Access Hodu Student & Parent Portal"
      className={`group relative inline-flex items-center justify-center p-[1.5px] rounded-xl transition-all duration-300 bg-gradient-to-br from-brand-maroon/90 via-brand-maroon/30 to-transparent hover:bg-brand-maroon hover:shadow-[0_0_12px_rgba(146,30,31,0.45)] active:scale-95 ${className}`}
    >
      <div
        className={`flex items-center justify-center gap-2 rounded-[10px] bg-[#1a1a1a] group-hover:bg-[#120708] transition-all duration-200 text-white ${
          compact ? 'px-3 py-1.5' : 'px-3.5 py-2'
        }`}
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-4 h-4 fill-white transition-transform group-hover:scale-105 shrink-0"
        >
          <g data-name="Layer 2" id="Layer_2">
            <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z" />
          </g>
        </svg>
        <span className="text-xs font-bold text-white tracking-wide whitespace-nowrap">
          Log In
        </span>
      </div>
    </a>
  )
}
