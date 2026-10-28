import { Link } from 'react-router-dom'
import Logo from './Logo'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-slate">
            Interners links to postings on third-party platforms and is not affiliated with
            them.
          </p>
        </div>
        {/* <div className="flex gap-6 text-sm font-medium">
          <Link to="/login" className="hover:underline">
            Log in
          </Link>
          <Link to="/register" className="hover:underline">
            Sign up
          </Link>
        </div> */}
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-8 text-sm text-slate sm:px-8">
        &copy; {YEAR} Interners
      </p>
    </footer>
  )
}
