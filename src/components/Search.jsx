import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='search'>
        <h3 className='text-cyan-900 pl-10 text-2xl'>Suche</h3>
        <div>
            <img src="search.svg" alt="search" />
            <input 
            type="text"
            placeholder='Search through thousands of titles'
            value={searchTerm}
            onChange={(event)=>setSearchTerm(event.target.value)} />
        </div>
    </div>
  )
}

export default Search
