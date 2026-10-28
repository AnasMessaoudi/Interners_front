import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import CvPopUp from "../components/CvPopUp";
import OfferCard from "../components/OfferCard";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const OFFERS_URL = "https://www.arbeitnow.com/api/job-board-api";
const PAGES_TO_LOAD = 3; // Arbeitnow pages fetched up front, so there are enough internships to browse
const PAGE_SIZE = 20;

// Arbeitnow has no "internship" filter, so we match on the title, tags and job types.
const INTERNSHIP_PATTERN =
    /\b(intern|interns|internship|internships|praktik\w*|werkstudent\w*|working student|trainee|stagiaire)\b/i;

function isInternship(offer) {
    const text = [
        offer.title,
        ...(Array.isArray(offer.tags) ? offer.tags : []),
        ...(Array.isArray(offer.job_types) ? offer.job_types : []),
    ]
        .filter(Boolean)
        .join(" ");
    return INTERNSHIP_PATTERN.test(text);
}

function getSearchableText(offer) {
    return [
        offer.title,
        offer.company_name,
        offer.location,
        ...(Array.isArray(offer.tags) ? offer.tags : []),
        ...(Array.isArray(offer.job_types) ? offer.job_types : []),
        offer.remote ? "remote" : "",
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

// Page numbers with gaps, e.g. [1, "…", 4, 5, 6, "…", 12]
function getPageItems(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total, current - 1, current, current + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    const items = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) items.push("…");
        items.push(p);
    });
    return items;
}

function Pagination({ page, totalPages, onChange }) {
    if (totalPages <= 1) return null;

    return (
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
            <button
                type="button"
                className="btn btn-line"
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
            >
                Previous
            </button>
            {getPageItems(page, totalPages).map((item, index) =>
                item === "…" ? (
                    <span key={`gap-${index}`} className="px-1 text-slate" aria-hidden="true">
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onChange(item)}
                        aria-label={`Page ${item}`}
                        aria-current={item === page ? "page" : undefined}
                        className={`btn min-w-11 ${item === page ? "btn-ink" : "btn-line"}`}
                    >
                        {item}
                    </button>
                ),
            )}
            <button
                type="button"
                className="btn btn-line"
                onClick={() => onChange(page + 1)}
                disabled={page === totalPages}
            >
                Next
            </button>
        </nav>
    );
}

export default function Discover() {
    const [offers, setOffers] = useState([]);
    const [search, setSearch] = useState("");
    const [internshipsOnly, setInternshipsOnly] = useState(true);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadCount, setReloadCount] = useState(0);
    const listTop = useRef(null);
    const {user} = useContext(AuthContext);
    useEffect(() => {
    let isCurrent = true;

    const fetchPage = async (page) => {
        const response = await fetch(`${OFFERS_URL}?page=${page}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        return response.json();
    };

    const loadOffers = async () => {
        setLoading(true);
        setError("");

        try {
            const results = await Promise.allSettled(
                Array.from({ length: PAGES_TO_LOAD }, (_, i) => fetchPage(i + 1)),
            );

            const loaded = results.filter((r) => r.status === "fulfilled");
            if (loaded.length === 0) throw results[0].reason;

            // Merge pages and drop duplicates (also covers the API ignoring the page parameter).
            const bySlug = new Map();
            for (const result of loaded) {
                const data = result.value?.data;
                if (!Array.isArray(data)) {
                    throw new Error("The offers service returned an unexpected response.");
                }
                for (const offer of data) {
                    bySlug.set(offer.slug || offer.url || `${offer.title}-${bySlug.size}`, offer);
                }
            }

            if (isCurrent) {
                setOffers([...bySlug.values()]);
            }
        } catch (loadError) {
            if (isCurrent) {
                setError(
                    loadError instanceof TypeError
                        ? "We couldn't reach the offers service. Check your connection and try again."
                        : "We couldn't load offers right now. Please try again.",
                );
            }
        } finally {
            if (isCurrent) {
                setLoading(false);
            }
        }
    };

    loadOffers();
    return () => {
        isCurrent = false;
    };
}, [reloadCount]);

    const normalizedSearch = search.trim().toLowerCase();
    const filteredOffers = offers
        .filter((offer) => !internshipsOnly || isInternship(offer))
        .filter((offer) => !normalizedSearch || getSearchableText(offer).includes(normalizedSearch));

    const totalPages = Math.max(1, Math.ceil(filteredOffers.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const firstIndex = (currentPage - 1) * PAGE_SIZE;
    const visibleOffers = filteredOffers.slice(firstIndex, firstIndex + PAGE_SIZE);

    const goToPage = (nextPage) => {
        setPage(nextPage);
        listTop.current?.scrollIntoView();
    };

    return (
        <div className="min-h-screen bg-paper">
            <Navbar />
            <main className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
                <section aria-labelledby="discover-title">
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate">
                        Your next opportunity starts here
                    </p>
                    <h1
                        id="discover-title"
                        className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl"
                    >
                        Discover internships
                    </h1>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate sm:text-lg">
                        Search internship offers by role, company, location, or skill.
                    </p>

                    <div className="mt-8 rounded-2xl border border-line bg-white-soft p-3 shadow-[0_18px_40px_-28px_rgba(22,33,62,0.45)] sm:p-4">
                        <label htmlFor="offer-search" className="sr-only">
                            Search internship offers
                        </label>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <svg
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <circle cx="10.8" cy="10.8" r="6.8" />
                                    <path d="m16 16 4.2 4.2" />
                                </svg>
                                <input
                                    id="offer-search"
                                    type="search"
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="Search by title, company, location, or skill"
                                    className="h-12 w-full rounded-lg border border-line bg-paper pl-12 pr-4 text-ink placeholder:text-slate focus:border-ink focus:outline-none"
                                />
                            </div>
                            {search && (
                                <button
                                    type="button"
                                    className="btn btn-line"
                                    onClick={() => {
                                        setSearch("");
                                        setPage(1);
                                    }}
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                        <label className="mt-3 flex cursor-pointer items-center gap-2.5 px-1 text-sm font-medium ">
                            <input
                                type="checkbox"
                                checked={internshipsOnly}
                                onChange={(event) => {
                                    setInternshipsOnly(event.target.checked);
                                    setPage(1);
                                }}
                                className="h-4 w-4 accent-ink"
                            />
                            Internships only
                        </label>
                    </div>
                </section>

                <section className="mt-8" aria-labelledby="offers-heading" ref={listTop}>
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                        <h2 id="offers-heading" className="font-display text-2xl font-bold">
                            Internship offers
                        </h2>
                        {!loading && !error && filteredOffers.length > 0 && (
                            <p className="text-sm font-medium text-slate" aria-live="polite">
                                Showing {firstIndex + 1}–{firstIndex + visibleOffers.length} of{" "}
                                {filteredOffers.length}{" "}
                                {filteredOffers.length === 1 ? "offer" : "offers"}
                            </p>
                        )}
                    </div>

                    {loading ? (
                        <div
                            className="rounded-xl border border-line bg-white-soft px-5 py-12 text-center text-slate"
                            role="status"
                        >
                            Loading internship offers...
                        </div>
                    ) : error ? (
                        <div
                            className="rounded-xl border border-line bg-white-soft px-5 py-10 text-center"
                            role="alert"
                        >
                            <p className="font-semibold text-error">{error}</p>
                            <button
                                type="button"
                                className="btn btn-ink mt-5"
                                onClick={() => setReloadCount((count) => count + 1)}
                            >
                                Try again
                            </button>
                        </div>
                    ) : visibleOffers.length > 0 ? (
                        <>
                            <ul className="space-y-4">
                                {visibleOffers.map((offer, index) => (
                                    <li key={offer.slug || offer.url || `${offer.title}-${index}`}>
                                        <OfferCard offer={offer} hasCv={user.hasCv} />
                                    </li>
                                ))}
                            </ul>
                            <Pagination
                                page={currentPage}
                                totalPages={totalPages}
                                onChange={goToPage}
                            />
                        </>
                    ) : (
                        <div className="rounded-xl border border-line bg-white-soft px-5 py-12 text-center">
                            <p className="font-display text-lg font-bold">No matching offers</p>
                            <p className="mt-2 text-sm text-slate">
                                {internshipsOnly
                                    ? "Try a different search, or turn off “Internships only” to see every job."
                                    : "Try a different title, company, location, or skill."}
                            </p>
                        </div>
                    )}
                </section>
            </main>
            <CvPopUp />
        </div>
    );
}