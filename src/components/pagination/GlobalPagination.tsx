interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function GlobalPagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Logic to calculate the range of visible pages (3 at a time)
  // This shifts the window: 1-3, then 4-6, etc.
  const groupSize = 3;
  const currentGroup = Math.ceil(currentPage / groupSize);
  const startPage = (currentGroup - 1) * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className='flex items-center justify-center gap-2 mt-8'>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='px-4 py-2 rounded-lg bg-[#8B9F86] border border-white/10 text-white/60 disabled:opacity-30 hover:bg-[#8ea887] transition-colors font-medium text-sm cursor-pointer'
      >
        Prev
      </button>

      {/* Page Numbers */}
      <div className='flex gap-1'>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`w-10 h-10 rounded-lg border text-sm transition-all ${
              currentPage === pageNumber
                ? "bg-[#8B9F86] text-black border-[#8B9F86] font-bold"
                : "bg-[#8B9F86] border-[#8B9F86] text-white/60 hover:border-[#8B9F86]/50"
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='px-4 py-2 rounded-lg bg-[#8B9F86] border border-white/10 text-white/60 disabled:opacity-30 hover:bg-[#8ea887] transition-colors font-medium text-sm cursor-pointer'
      >
        Next
      </button>
    </div>
  );
}
