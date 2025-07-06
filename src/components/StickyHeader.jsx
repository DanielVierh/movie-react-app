import React from 'react'
import GoBackButton from './GoBackButton'

const StickyHeader = ({title}) => {
  return (
    <div>
        <header className='sticky-header'>
            <GoBackButton/>
            <h2 className='text-center pb-5'>{title}</h2>
        </header>
    </div>
  )
}

export default StickyHeader