function StatsBar({ total, active, completed, onToggleAll, allDone }) {
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0

    return (
        <div className="glass rounded-2xl px-4 py-3 shadow-lg shadow-black/20 flex items-center gap-4">
            {/* Toggle all */}
            <button
                onClick={onToggleAll}
                title={allDone ? 'Mark all active' : 'Mark all complete'}
                className={`
          flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center
          ${allDone
                        ? 'border-violet-500 bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]'
                        : 'border-slate-600 hover:border-violet-500'
                    }
        `}
            >
                {allDone && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>

            {/* Progress bar */}
            <div className="flex-1">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{active} remaining</span>
                    <span>{pct}% done</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-500 ease-in-out"
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>

            {/* Count badge */}
            <div className="flex-shrink-0 text-center">
                <div className="text-lg font-bold text-white leading-none">{total}</div>
                <div className="text-xs text-slate-500">tasks</div>
            </div>
        </div>
    )
}

export default StatsBar
