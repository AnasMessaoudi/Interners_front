import ScorePopUp from "./ScorePopUp";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { API_URL } from "../config";
function stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
}
const LOGO_COLORS = [
    { bg: "#16213e", fg: "#f6f7f9" },
    { bg: "#ffd93d", fg: "#16213e" },
    { bg: "#5a6782", fg: "#ffffff" },
    { bg: "#d8dde6", fg: "#16213e" },
];

function CompanyLogo({ name }) {
    const label = (name || "?").trim();
    const words = label.split(/\s+/).filter(Boolean);
    const initials =
        (words.length > 1 ? words[0][0] + words[1][0] : label.slice(0, 2)).toUpperCase() || "?";
    let hash = 0;
    for (const char of label) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    const color = LOGO_COLORS[hash % LOGO_COLORS.length];

    return (
        <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-display text-lg font-extrabold"
            style={{ backgroundColor: color.bg, color: color.fg }}
            aria-hidden="true"
        >
            {initials}
        </div>
    );
}

export default function OfferCard({ offer,hasCv }) {
    const [expanded, setExpanded] = useState(false);
    const [scoreOpen, setScoreOpen] = useState(false);
    const [scoreLoading, setScoreLoading] = useState(false);
    const [scoreError, setScoreError] = useState("");
    const [scoreResult, setScoreResult] = useState(null);
    const [scoreReason,setScoreReason] = useState("");
    const tags = Array.isArray(offer.tags) ? offer.tags.slice(0, 4) : [];
    const postedDate = offer.created_at
    ? new Date(offer.created_at * 1000).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
    : null;
    
    const rawDescription =
    offer.description ||
    offer.summary ||
    offer.details ||
    "No description is available for this offer.";
    
    const description = stripHtml(rawDescription)
    .replace(/\s+/g, " ")
    .trim();
    
    const words = description.split(/\s+/);
    const needsExpansion = words.length > 60;
    
    const displayedDescription =
    expanded || !needsExpansion
    ? description
    : words.slice(0, 60).join(" ") + "...";
    
    const HandleCompareToMyCv = async () => {
    setScoreOpen(true);
    if (scoreResult) return;                 // already scored: just reopen, no new request

    const token = localStorage.getItem("token");
    if (!token) {
        setScoreError("Please log in again.");
        return;
    }
    setScoreLoading(true);
    setScoreError("");
    
    try {
        const response = await axios.post(
            `${API_URL}api/Ai/CompareCv`,
            { words},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Data:",response.data.response);
        setScoreResult(response.data.response.score);
        setScoreReason(response.data.response.reason);
    } catch (err) {
        setScoreError(err.response?.data?.message || "Could not score this offer. Try again.");
    } finally {
        setScoreLoading(false);
    }
    };
    const saveOffer = async ()=>{
        const token = localStorage.getItem("token");
        if (!token) {
            setScoreError("Please log in again.");
            return;
        }
        //hadhi bch tabda tab3th post req lel new doc elli fih el offers el 5assin bl user 
        const response = await axios.post(
            `${API_URL}api/`,
            { words},
            { headers: { Authorization: `Bearer ${token}` } }
        );
    };
    
    return (
        <article className="rounded-xl border border-line bg-white-soft p-5 transition-shadow hover:shadow-[0_12px_30px_-20px_rgba(22,33,62,0.5)] sm:p-6">
            <div className="flex gap-4">
                <CompanyLogo name={offer.company_name} />

                <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h2 className="font-display text-xl font-bold leading-snug tracking-tight">
                            {offer.title || "Internship opportunity"}
                        </h2>

                        <p className="mt-1 font-semibold text-slate">
                            {offer.company_name || "Company not listed"}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate">
                            {offer.location && <span>{offer.location}</span>}

                            {offer.remote && (
                                <>
                                    {offer.location && (
                                        <span aria-hidden="true">&middot;</span>
                                    )}
                                    <span>Remote</span>
                                </>
                            )}

                            {postedDate && (
                                <>
                                    {(offer.location || offer.remote) && (
                                        <span aria-hidden="true">&middot;</span>
                                    )}
                                    <span>Posted {postedDate}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {offer.url && (
                        <a
                            className="btn btn-ink shrink-0 self-start"
                            href={offer.url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View offer
                            <span aria-hidden="true">↗</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Description */}
            <section className="mt-5 border-t border-line pt-4">
                <h3 className="text-sm font-bold text-ink">
                    Description
                </h3>

                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate">
                    {displayedDescription}
                </p>

                {needsExpansion && (
                    <button
                        type="button"
                        onClick={() => setExpanded((previous) => !previous)}
                        aria-expanded={expanded}
                        className="mt-2 text-sm font-bold text-ink underline underline-offset-4 hover:opacity-70"
                    >
                        {expanded ? "Show less" : "..."}
                    </button>
                )}
            </section>

            {tags.length > 0 && (
                <ul
                    className="mt-5 flex flex-wrap gap-2"
                    aria-label="Offer skills and categories"
                >
                    {tags.map((tag) => (
                        <li
                            key={tag}
                            className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-slate"
                        >
                            {tag}
                        </li>

                    ))}
                </ul>
            )}
            {hasCv && (
                <div className="flex min-w-0 flex-1 flex-col-reverse">
                    <button
                        className="btn btn-marker shrink-0 self-end"
                        onClick={HandleCompareToMyCv}
                        disabled={scoreLoading}
                    >
                        {scoreLoading ? "Comparing..." : "Compare to my cv"}
                    </button>
                </div>
            )}

            {scoreOpen && (
                <ScorePopUp
                    offerTitle={offer.title}
                    loading={scoreLoading}
                    error={scoreError}
                    result={scoreResult}
                    reason={scoreReason}
                    onClose={() => setScoreOpen(false)}
                    saveOffer = {saveOffer}
                />
            )}
            
        </article>
    );
}
