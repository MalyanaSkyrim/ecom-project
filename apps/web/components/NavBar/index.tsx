'use client'

import LeftNavBar from './LeftNavBar'
import RightNavBar from './RightNavBar'

const NavBar = () => {
  return (
    <div className="bg-white px-5 md:px-8 lg:px-10 xl:px-20">
      <div className="flex h-20 items-center justify-between space-x-10 shadow-sm">
        <LeftNavBar />
        <RightNavBar />
      </div>
    </div>
  )
}

export default NavBar
