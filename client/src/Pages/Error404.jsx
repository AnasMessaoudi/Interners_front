export default function Error404() {
    return(<div className="flex justify-center items-center h-screen bg-amber-400 flex-col gap-4">
        <h1 className="font-display text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]">Unavailable page </h1>
        <h1 className="mt-6 max-w-136 text-lg leading-relaxed text-[2.75rem] font-bold">
            Error 404
        </h1>
    </div>)
}