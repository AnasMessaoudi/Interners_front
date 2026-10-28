import { useEffect } from "react";

export default function ScorePopUp({ offerTitle, loading, error, result,reason, onClose,saveOffer }) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const score = result ;
    const verdict = score >= 70 ? "Strong match" : score >= 40 ? "Partial match" : "Weak match";

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="score-title"
                className="relative w-full max-w-md rounded-2xl border border-line bg-white-soft p-6 shadow-2xl sm:p-8"
            >
                <button
                    type="button"
                    aria-label="Close score dialog"
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate transition-colors hover:bg-paper hover:text-ink"
                >
                    <span aria-hidden="true">&times;</span>
                </button>

                <h2 id="score-title" className="pr-10 font-display text-2xl font-bold text-ink">
                    Match with your CV
                </h2>
                <p className="mt-1 text-sm text-slate">{offerTitle}</p>

                {loading && (
                    <p role="status" className="mt-6 text-sm text-slate">
                        Comparing your CV to this offer...
                    </p>
                )}

                {error && !loading && (
                    <p role="alert" className="mt-6 text-sm font-medium text-error">
                        {error}
                    </p>
                )}

                {result && !loading && (
                    <div className="mt-6">
                        <div className="flex items-baseline justify-between gap-3">
                            <p className="font-display text-5xl font-extrabold text-ink">
                                {score}
                                <span className="text-xl text-slate">/100</span>
                            </p>
                            <span className="rounded bg-marker px-2 py-0.5 text-sm font-semibold">
                                {verdict}
                            </span>
                        </div>

                        <div
                            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-paper"
                            role="progressbar"
                            aria-label="Match score"
                            aria-valuenow={score}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        >
                            <div className="h-full rounded-full bg-ink" style={{ width: `${score}%` }} />
                        </div>

                        <h3 className="mt-5 text-sm font-bold text-ink">Why this score</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate">{reason}</p>
                    </div>
                )}

                <div className="flex justify-between">
                    <button type="button" onClick={onClose} className="btn btn-ink mt-6">
                        Close
                    </button>
                    <button type="button" onClick={saveOffer} className="btn btn-ink mt-6">
                        Save offer
                    </button>
                </div>
            </section>
        </div>
    );
}
