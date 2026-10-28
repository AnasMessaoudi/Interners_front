import { Link } from 'react-router-dom'
import Logo from './Logo'
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
export default function Navbar() {
  const {logged,setLogged,user,setUser} = useContext(AuthContext);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogged(false);
    setUser(null);
    setProfileMenuOpen(false);
  };

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
        aria-label="Main"
      >
        <Logo />

        <div className="hidden items-center gap-8 text-[0.9375rem] font-medium text-slate md:flex">
          <a href="/#features" className="hover:text-ink">
            What you get
          </a>
          <a href="/#how" className="hover:text-ink">
            How it works
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {(logged && user) ? (
            <div className="relative">
              <button
                type="button"
                className="cursor-pointer inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-2.5 text-paper transition-colors hover:bg-[#0e1730]"
                aria-label="Open profile menu"
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
                onClick={() => setProfileMenuOpen((open) => !open)}
              >
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white-soft text-sm font-bold uppercase text-ink"
                >
                  {user.username?.trim().charAt(0) || "?"}
                </span>
                <svg
                  aria-hidden="true"
                  className={`h-4 w-4 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 z-10 mt-2 min-w-48 rounded-xl border border-line bg-white-soft p-2 shadow-lg"
                  role="menu"
                >
                  <p className="truncate px-3 py-2 text-sm font-semibold text-ink">
                    {user.username || "Profile"}
                  </p>
                  <div className="my-1 border-t border-line" />
                  <Link
                    to="/profile"
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink hover:bg-paper"
                    role="menuitem"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink hover:bg-paper"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn text-ink hover:underline">
                Log in
              </Link>
              <Link to="/register" className="btn btn-ink">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
