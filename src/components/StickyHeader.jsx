import React from 'react'
import GoBackButton from './GoBackButton'

const StickyHeader = ({title, link_to_main}) => {
  return (
    <div>
        <header className='sticky-header'>
              <a href={link_to_main} className='type-cta text-start px-7 py-3 mt-10 mb-5 text-xl fit-content cursor-pointer w-fit'>Home</a>
             <h2 className='text-center pb-5'>{title}</h2>
        </header>
    </div>
  )
}

export default StickyHeader