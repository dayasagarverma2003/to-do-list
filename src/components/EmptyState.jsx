const MESSAGES = {
    all: {
        icon: (
            <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
        title: 'Your to-do list is empty',
        sub: 'Add your first task above and start getting things done!',
    },
    active: {
        icon: (
            <svg className="w-12 h-12 text-emerald-600/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'All caught up! 🎉',
        sub: 'No active tasks — every task is complete.',
    },
    completed: {
        icon: (
            <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Nothing completed yet',
        sub: 'Start checking off tasks to see them here.',
    },
}

function EmptyState({ filter, hasTodos }) {
    const msg = MESSAGES[filter] || MESSAGES.all
    return (
        <div className="glass rounded-2xl py-14 px-6 text-center shadow-lg shadow-black/10 animate-scale-in">
            <div className="flex justify-center mb-4 animate-float">
                {msg.icon}
            </div>
            <h3 className="text-slate-300 font-semibold text-lg mb-1">{msg.title}</h3>
            <p className="text-slate-500 text-sm">{msg.sub}</p>
        </div>
    )
}

export default EmptyState
