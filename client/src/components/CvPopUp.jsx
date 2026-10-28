// el display hadhi lazmni na3melha fl bd 3l5tr kol refresh lel page tseti el display lel true 
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import CvImport from "./CvImport";

export default function CvPopUp() {
    const { logged ,user,setUser} = useContext(AuthContext);
    const [pop, setPop] = useState(false);
    
    if (!logged ||  !user || user.hasCv) return null;
    return (
        <aside
            aria-label="Upload your CV"
            className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-line bg-white-soft p-5 shadow-[0_18px_40px_-16px_rgba(22,33,62,0.35)] sm:bottom-6 sm:right-6"
        >
            <button
                type="button"
                aria-label="Close CV upload message"
                onClick={() => setDisplay(false)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate transition-colors hover:bg-paper hover:text-ink"
            >
                <span aria-hidden="true">&times;</span>
            </button>
            <h3 className="pr-8 font-display text-lg font-bold text-ink">
                Looking for a better experience?
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate">
                Upload your CV to get started &nbsp;
                <button
                    type="button"
                    className="cursor-pointer underline underline-offset-2"
                    onClick={() => setPop(true)}
                >
                    from here.
                </button>
            </p>
            {pop && <CvImport onClose={() => setPop(false)} onUpload ={()=>{
                setPop(false);
                setUser({...user,hasCv:true});
            }}/>}
        </aside>
    );
}