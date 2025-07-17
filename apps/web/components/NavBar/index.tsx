'use client'

import LeftNavBar from './LeftNavBar'
import RightNavBar from './RightNavBar'

const NavBar = () => {
  return (
    <div className="bg-white px-4">
      <div className="container m-auto flex h-20 items-center justify-between space-x-10 shadow-sm">
        <LeftNavBar />
        <RightNavBar />
      </div>
    </div>
  )
}

export default NavBar
