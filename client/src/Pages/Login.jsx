import { useState,useContext,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import axios from 'axios'
import { API_URL } from '../config'
import { AuthContext } from '../context/AuthContext'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SAMPLE = {
  title: 'Software engineering intern',
  company: 'Atlas Data Labs',
  place: 'Tunis, hybrid',
  source: 'LinkedIn',
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [token,setToken] = useState('');
  const navigate = useNavigate();
  const { setUser,logged, setLogged } = useContext(AuthContext);
  useEffect(()=>{
    console.log("logged in test");
    if(logged){
      console.log(logged);
      navigate('/discover');
    }
  },[logged]);
  function handleSubmit(event) {
    event.preventDefault();
    const handleLogin = async (email,password) =>{
      try{
      const response =  await axios.post(`${API_URL}api/auth/login`,{"email":email,"password":password},{withCredentials:true});
      setUser(response.data.user);
      console.log("User",response.data.user);
      setLogged(true);
      setToken(response.data.token);
      localStorage.setItem('token',response.data.token);
      navigate('/');
      }catch(err){
        const message = err.response?.data?.message || err.message || 'Unable to log in. Please try again.';
        console.error(err);
        setError(message);
      }
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    setError('');
    handleLogin(email.trim(),password);
  }
  
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <main className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight">
            Welcome back
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate">
            Pick up your shortlist where you left it.
          </p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="block min-h-11 w-full rounded-lg border border-line bg-white-soft px-3.5 py-2.5 text-base text-ink placeholder:text-slate/70"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={revealed ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="block min-h-11 w-full rounded-lg border border-line bg-white-soft px-3.5 py-2.5 pr-16 text-base text-ink placeholder:text-slate/70"
                  placeholder="At least 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setRevealed((visible) => !visible)}
                  aria-pressed={revealed}
                  aria-label={revealed ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 px-3.5 text-sm font-semibold text-slate hover:text-ink"
                >
                  {revealed ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-ink w-full">
              Log in
            </button>
          </form>

          <p className="mt-8 text-sm text-slate">
            New to Interners?{' '}
            <Link to="/Register" className="font-semibold text-ink underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </main>

      <aside
        className="hidden flex-col justify-end bg-ink p-12 text-paper lg:flex"
        aria-hidden="true"
      >
        <p className="font-display text-3xl font-bold leading-snug">
          Save the postings worth applying to, and come back to them later.
        </p>
        <div className="mt-10 max-w-sm rounded-xl border border-paper/20 p-5">
          <p className="text-sm text-paper/70">{SAMPLE.source}</p>
          <p className="mt-1 font-display text-lg font-bold">{SAMPLE.title}</p>
          <p className="mt-0.5 text-sm text-paper/80">
            {SAMPLE.company} &middot; {SAMPLE.place}
          </p>
          <span className="mt-4 inline-block rounded bg-marker px-2 py-0.5 text-sm font-semibold text-ink">
            Saved
          </span>
        </div>
      </aside>
    </div>
  )
}
