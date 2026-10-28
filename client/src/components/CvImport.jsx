import axios from "axios";
import { useEffect, useState } from "react";
import pdfToText from 'react-pdftotext';
import {API_URL} from '../config';
export default function CvImport({ onClose ,onUpload}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        setError("");
        setSelectedFile(null);

        if (!file) return;

        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
            setError("Please choose a PDF file.");
            event.target.value = "";
            return;
        }
        setSelectedFile(file);
    };
    const SubmitFile =  async (event)=>{
        event.preventDefault();
        if (!selectedFile) {
        setError("Please select a PDF file first.");
        return;
        }
        setLoading(true);
        setError("");
        try{
            const text = await pdfToText(selectedFile);
            await axios.post(`${API_URL}api/cv`,
        {fileName: selectedFile.name, extractedText: text },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        onUpload(); 
        console.log(text);
        }catch (err) {
            setError(err.response?.data?.message || "Could not upload your CV. Try again.");
        } finally {
            setLoading(false);
        }      
    }

    return (
        <form  onSubmit={SubmitFile}
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="cv-import-title"
                className="relative w-full max-w-md rounded-2xl border border-line bg-white-soft p-6 shadow-2xl sm:p-8"
            >
                <button
                    type="button"
                    aria-label="Close CV upload dialog"
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate transition-colors hover:bg-paper hover:text-ink"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
                <h2 id="cv-import-title" className="pr-10 font-display text-2xl font-bold text-ink">
                    Upload your CV
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                    Choose your CV as a PDF file.
                </p>
                <label
                    htmlFor="cv-pdf-file"
                    className="mt-6 block text-sm font-semibold text-ink"
                >
                    CV (PDF)
                </label>
                <input
                    id="cv-pdf-file"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    aria-describedby={error ? "cv-file-error" : "cv-file-help"}
                    className="mt-2 block w-full cursor-pointer rounded-lg border border-line bg-paper p-3 text-sm text-ink file:mr-4 file:rounded-md file:border-0 file:bg-ink file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-slate"
                />
                {error ? (
                    <p id="cv-file-error" role="alert" className="mt-2 text-sm font-medium text-error">
                        {error}
                    </p>
                ) : (
                    <p id="cv-file-help" className="mt-2 text-sm text-slate">
                        {selectedFile ? `Selected: ${selectedFile.name}` : "PDF files only."}
                    </p>
                )}
                <button type="submit" disabled={loading} className="btn btn-ink mt-2 items-end">
                    {loading ? "Uploading..." : "Submit"}
                </button>
            </section>
        </form>
    );
}