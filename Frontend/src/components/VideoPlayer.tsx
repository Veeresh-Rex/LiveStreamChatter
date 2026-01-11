import { Button } from './ui/button'

export function VideoPlayer() {
    return (
        <div className="flex-1 flex flex-col min-h-0 bg-black w-full h-full">
            <div className="flex-1 min-h-0 relative bg-black flex items-center justify-center p-0 lg:p-4 lg:pb-0 w-full h-full">
                {/* Video Player Container */}
                <div className="w-full h-full lg:max-w-[1600px] flex items-center justify-center relative group">
                    <div className="w-full h-full lg:h-auto lg:aspect-video lg:max-h-full shadow-2xl ring-0 lg:ring-1 lg:ring-white/10 lg:rounded-xl overflow-hidden relative">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&controls=0&loop=1&playlist=jfKfPfyJRdk"
                            title="Lofi Girl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>

                        {/* Overlay UI */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 lg:p-6">
                            <div className="w-full flex justify-between items-center text-white">
                                <div className="flex gap-4">
                                    <Button size="icon" variant="secondary" className="rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur border-none">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        <span className="font-bold text-sm tracking-widest uppercase">Live</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Info - Hidden on mobile */}
            <div className="hidden lg:block flex-none p-4 lg:p-6 space-y-4 overflow-y-auto max-h-[30vh] lg:max-h-none">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold line-clamp-1 lg:line-clamp-2 leading-tight">
                    lofi hip hop radio - beats to relax/study to ☕️
                </h1>
            </div>
        </div>
    )
}
