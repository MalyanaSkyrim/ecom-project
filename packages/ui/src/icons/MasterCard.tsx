import React from 'react'

export const MasterCard = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
      className={className}>
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {' '}
        <g fill="none" fillRule="evenodd">
          {' '}
          <circle cx="7" cy="12" r="7" fill="#EA001B"></circle>{' '}
          <circle
            cx="17"
            cy="12"
            r="7"
            fill="#FFA200"
            fillOpacity=".8"></circle>{' '}
        </g>{' '}
      </g>
    </svg>
  )
}
