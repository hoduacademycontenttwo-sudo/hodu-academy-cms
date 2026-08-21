import PencilLoader from '@/components/hodu/PencilLoader'

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-bg/90 dark:bg-[#120708]/90 backdrop-blur-md animate-fade-in">
      <PencilLoader
        size={150}
        label="HODU ACADEMY • LOADING..."
      />
    </div>
  )
}
