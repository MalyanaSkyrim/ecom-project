import React from 'react'

export const Warn = function Warn({
  ref,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={props.className}
      ref={ref}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2058_15873)">
        <path
          d="M12 6C12 7.18669 11.6481 8.34673 10.9888 9.33342C10.3295 10.3201 9.39246 11.0891 8.2961 11.5433C7.19975 11.9974 5.99335 12.1162 4.82946 11.8847C3.66557 11.6532 2.59648 11.0818 1.75736 10.2426C0.918247 9.40352 0.346802 8.33443 0.115291 7.17054C-0.11622 6.00665 0.00259972 4.80026 0.456725 3.7039C0.910851 2.60754 1.67989 1.67047 2.66658 1.01118C3.65328 0.351894 4.81331 0 6 0C7.59077 0.00172054 9.1159 0.634414 10.2407 1.75926C11.3656 2.8841 11.9983 4.40923 12 6ZM6.5 2.5H5.5V7.5H6.5V2.5ZM6.5 8.5H5.5V9.5H6.5V8.5Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2058_15873">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
