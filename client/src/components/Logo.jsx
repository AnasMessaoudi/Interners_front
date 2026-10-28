import { Link } from 'react-router-dom'

export default function Logo({ light = false }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight ${
        light ? 'text-paper' : 'text-ink'
      }`}
      aria-label="Interners home"
    >
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="7" fill={light ? '#F6F7F9' : '#16213E'} />
        <rect x="7" y="9" width="18" height="4" rx="1" fill="#FFD93D" />
        <rect x="7" y="15" width="13" height="3" rx="1" fill={light ? '#16213E' : '#F6F7F9'} />
        <rect x="7" y="21" width="16" height="3" rx="1" fill={light ? '#16213E' : '#F6F7F9'} />
      </svg>
      Interners
    </Link>
  )
}
