import React from 'react'
import GoBackButton from './GoBackButton'

const StickyHeader = ({title, link_to_main}) => {
  return (
    <div>
        <header className='sticky-header'>
              <a href={link_to_main} className='text-start px-10 py-5 text-2xl fit-content cursor-pointer bg-blue-950 w-fit'>Home</a>
             <h2 className='text-center pb-5'>{title}</h2>
        </header>
    </div>
  )
}

export default StickyHeader