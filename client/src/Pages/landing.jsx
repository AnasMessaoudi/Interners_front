import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// Illustrative postings only. Real data comes from the backend later.
const SAMPLE_POSTINGS = [
  {
    title: 'Software engineering intern',
    company: 'Atlas Data Labs',
    place: 'Tunis, hybrid',
    source: 'LinkedIn',
    closes: 'Closes 18 Oct',
    urgent: true,
  },
  {
    title: 'Data analyst intern (final-year project)',
    company: 'Medina Software',
    place: 'Sfax, on-site',
    source: 'Indeed',
    closes: 'Closes 25 Oct',
  },
  {
    title: 'Frontend developer intern',
    company: 'Kairos Cloud',
    place: 'Remote',
    source: 'Company site',
    closes: 'Closes 30 Oct',
  },
  {
    title: 'Cybersecurity intern',
    company: 'Nordlys Systems',
    place: 'Sousse, on-site',
    source: 'LinkedIn',
    closes: 'Closes 2 Nov',
  },
]

const FEATURES = [
  {
    title: 'One feed instead of five tabs',
    body: 'Postings from LinkedIn, Indeed and other platforms land in a single list, so the same offer is not scattered across the web.',
  },
  {
    title: 'Filters that match a student search',
    body: 'Narrow by field, city, remote or on-site, and internship length until the list is short enough to read.',
  },
  {
    title: 'A shortlist you can return to',
    body: 'Save the postings worth a second look and pick up where you stopped.',
  },
  {
    title: 'Apply where the posting lives',
    body: 'Every posting links back to the platform it came from, so you apply on the original page.',
  },
]

const STEPS = [
  {
    title: 'We collect postings',
    body: 'Internship posts are gathered from LinkedIn, Indeed and other platforms.',
  },
  {
    title: 'You search once',
    body: 'Filter the combined feed and save what fits.',
  },
  {
    title: 'You apply at the source',
    body: 'Open the original posting and send your application there.',
  },
]

function HeroFeed() {
  return (
    <div className="rounded-2xl border border-line bg-white-soft shadow-[0_18px_40px_-24px_rgba(22,33,62,0.35)]">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <p className="font-display text-base font-bold">All internships</p>
        <p className="text-sm text-slate">Sample postings</p>
      </div>
      <ul>
        {SAMPLE_POSTINGS.map((p, i) => (
          <li
            key={p.title}
            className="feed-row flex flex-col gap-1 border-b border-line px-5 py-4 last:border-b-0"
            style={{ animationDelay: `${250 + i * 160}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="font-display text-[1.0625rem] font-bold leading-snug">{p.title}</p>
              <span className="shrink-0 rounded-md border border-line px-2 py-0.5 text-sm font-medium text-slate">
                {p.source}
              </span>
            </div>
            <p className="text-[0.9375rem] text-slate">
              {p.company} &middot; {p.place}
            </p>
            <p className="mt-1 text-sm font-semibold">
              <span className={p.urgent ? 'rounded bg-marker px-1.5 py-0.5' : ''}>{p.closes}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Landing() {
  const {logged,user,setLogged,setUser} = useContext(AuthContext);
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:pb-28 lg:pt-20">
          <div>
            <h1 className="font-display text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]">
              Every internship post, in one feed.
            </h1>
            <p className="mt-6 max-w-136 text-lg leading-relaxed text-slate">
              Interners collects internship postings from LinkedIn, Indeed and other platforms, so
              you search once instead of checking each site every day.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">              
              {!logged ?
              (<><Link to="/Register" className="btn btn-ink">
                Create an account
                </Link>
                <Link to="/Login" className="btn btn-line">
                Log in
              </Link>
              </>
              )
              : (
                <>
                <Link to="/Discover" className="btn btn-ink">
                Let's get started
                </Link>
                <button className="btn btn-line" onClick={()=>{
                  localStorage.removeItem("token");
                  setLogged(false);
                  setUser(null);
                }}>
                Log out
                </button>
                </>
              )
            }
            </div>
          </div>
          <HeroFeed />
        </section>

        {/* Features */}
        <section id="features" className="border-t border-line scroll-mt-4">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:py-28">
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:sticky lg:top-8 lg:self-start">
              Less searching, more applying.
            </h2>
            <dl>
              {FEATURES.map((f) => (
                <div key={f.title} className="border-t border-ink py-7 first:border-t-2 first:pt-6">
                  <dt className="font-display text-xl font-bold">{f.title}</dt>
                  <dd className="mt-2 max-w-xl text-base leading-relaxed text-slate">{f.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* How it works: a real sequence, so the steps are numbered */}
        <section id="how" className="scroll-mt-4 border-t border-line bg-white-soft">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              How it works
            </h2>
            <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-5 md:block">
                  <span
                    className="font-display text-6xl font-extrabold leading-none text-marker [-webkit-text-stroke:2px_var(--color-ink)]"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="md:mt-5">
                    <h3 className="font-display text-xl font-bold">{s.title}</h3>
                    <p className="mt-2 max-w-sm text-base leading-relaxed text-slate">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Closing call to action */}
        <section className="bg-ink text-paper">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:px-8 md:flex-row md:items-center md:justify-between lg:py-20">
            <h2 className="max-w-xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Start with one search.
            </h2>
            <div className="flex flex-wrap gap-3">
            {!logged ?
              (<><Link to="/Register" className="btn btn-marker">
                Create an account
              </Link>
                <Link to="/Login" className="btn btn-marker ">
                Log in
              </Link>
              </>
              )
              : (
                <>
                <Link to="/Discover" className="btn btn-marker">
                Let's get started
                </Link>
                <button className="btn btn-marker" onClick={()=>{
                  localStorage.removeItem("token");
                  setLogged(false);
                  setUser(null);
                }}>
                Log out
                </button>
                </>
              )
            }
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
