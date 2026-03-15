const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
]

function FilterBar({ filter, setFilter }) {
    return (
        <div className="flex items-center justify-center gap-1 glass rounded-2xl p-1.5 shadow-lg shadow-black/20">
            {FILTERS.map(f => (
                <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`
            flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200
            ${filter === f.key
                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-900/50'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }
          `}
                >
                    {f.label}
                </button>
            ))}
        </div>
    )
}

export default FilterBar
