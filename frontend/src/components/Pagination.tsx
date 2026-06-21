type paginationProps = {
    page: number,
    pages: number,
    onPageChange: (page: number) => void
}

const Pagination = ({page,pages,onPageChange}: paginationProps) => {
    const pageNumbers = []
    for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i)
    }
  return (
      <div className="flex flex-row justify-center">
          <ul className="border border-slate-300 rounded-lg flex">
              {pageNumbers?.map((number) => {
                  return (
                      <li key={number} className={`items-center px-2 py-1 ${page === number ? "bg-slate-300" : ""}`} >
                          <button onClick={() => onPageChange(number)}>{number}</button>
                      </li>
                  )
              })}
          </ul>
    </div>
  )
}

export default Pagination