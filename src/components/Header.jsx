function Header() {
    return (
        <div className="text-center animate-fade-in-down">
            {/* Icon with spinning ring */}
            <div className="relative inline-flex items-center justify-center mb-5">
                {/* Outer spinning ring */}
                <div
                    className="absolute w-20 h-20 rounded-full border-2 border-dashed border-violet-500/30 animate-spin-slow"
                />
                {/* Glowing ring */}
                <div
                    className="absolute w-[72px] h-[72px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
                        animation: 'pulse-glow 2.5s ease-in-out infinite',
                    }}
                />
                {/* Icon box */}
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 shadow-lg shadow-purple-900/60 flex items-center justify-center animate-float">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                    </svg>
                </div>

                {/* Sparkle dots */}
                {[
                    { top: '-4px', right: '4px', size: 'w-2 h-2', delay: '0s' },
                    { top: '8px', right: '-6px', size: 'w-1.5 h-1.5', delay: '0.4s' },
                    { top: '-2px', left: '2px', size: 'w-1.5 h-1.5', delay: '0.8s' },
                    { bottom: '4px', right: '-4px', size: 'w-1 h-1', delay: '1.2s' },
                ].map((s, i) => (
                    <span
                        key={i}
                        className={`absolute ${s.size} rounded-full bg-violet-400`}
                        style={{
                            top: s.top,
                            right: s.right,
                            left: s.left,
                            bottom: s.bottom,
                            animation: `bounce-in 0.6s ${s.delay} ease both, float 3s ${s.delay} ease-in-out infinite`,
                            opacity: 0.8,
                        }}
                    />
                ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight mb-2">
                <span className="gradient-text">TodoFlow</span>
            </h1>

            {/* Subtitle with wave letters */}
            <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">
                {'Organize · Focus · Achieve'.split('').map((char, i) => (
                    <span
                        key={i}
                        className="inline-block"
                        style={{
                            animation: char === ' ' ? 'none' : `wave 2.5s ease-in-out ${i * 0.06}s infinite`,
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </p>
        </div>
    )
}

export default Header
