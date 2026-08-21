export default function HoduLoading() {
  return (
    <div className="w-full animate-fade-in">
      {/* Top indeterminate loading bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-brand-border/40 overflow-hidden">
        <div className="h-full bg-brand-maroon animate-[marquee_1.2s_ease-in-out_infinite] w-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Hero skeleton */}
        <div className="space-y-4 max-w-2xl">
          <div className="h-4 w-28 bg-brand-border/40 rounded-full animate-pulse" />
          <div className="h-10 w-3/4 bg-brand-border/60 rounded-xl animate-pulse" />
          <div className="h-4 w-full bg-brand-border/30 rounded-lg animate-pulse" />
        </div>

        {/* Cards skeleton grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-brand-border rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="h-36 bg-brand-bg rounded-xl animate-pulse" />
              <div className="h-5 w-2/3 bg-brand-border/50 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-brand-border/30 rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-brand-border/30 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
