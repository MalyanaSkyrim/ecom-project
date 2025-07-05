'use client'

import { cva } from 'class-variance-authority'
import { Info, X } from 'lucide-react'
import React from 'react'

import { classMerge } from '@ecom/ui/lib/utils'

import { Checkbox } from '../Icons/Checkbox'
import { Error } from '../Icons/Error'
import { Warn } from '../Icons/Warn'

// Props
export interface ToastContentProps {
  /**
   * Allows adding classes to the container
   */
  className?: string
  /**
   * Toast variants
   */
  variant?: 'success' | 'info' | 'warning' | 'error'
  /**
   * title of the toast
   * */
  title: string
  /**
   * paragraph of the toast
   * */
  description?: string

  onClose?: () => void
}

const iconStyle = cva('mr-2 h-[14px] w-[14px]', {
  variants: {
    variant: {
      success: 'text-green-500',
      info: 'text-blue-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
    },
  },
})

// Styles
const classes = {
  base: 'flex bg-white w-[407px] h-auto justify-between rounded-md border-[0.5px] p-[16px] pb-[12px] [box-shadow:0px_4px_20px_rgba(0,_0,_0,_0.1)] gap-[10px] dark:bg-[#191919] dark:border-[#2F2F2F] max-[460px]:w-[100%]',
  title: 'text-[#3E414B] dark:text-white text-xs not-italic font-semibold',
  description:
    'mt-[8px] text-[#3E414B] dark:text-[#808082] text-sm not-italic font-normal text-sm text-ellipsis line-clamp-2',
  link: 'my-1 text-[#8291C3] not-italic font-medium text-xs hover:[text-decoration-line:underline]',
}

// Component
const ToastContent: React.FC<ToastContentProps> = (props) => {
  const { className, variant = 'info', title, description, onClose } = props

  const baseClassNames = classMerge(classes.base, className)

  // Switch case to display the right icon depending on the variant
  let ToastIcon

  switch (variant) {
    case 'success':
      ToastIcon = Checkbox
      break
    case 'info':
      ToastIcon = Info
      break
    case 'warning':
      ToastIcon = Warn
      break
    case 'error':
      ToastIcon = Error
      break
    default:
      ToastIcon = Info
  }

  return (
    <div className={baseClassNames}>
      <div className="flex flex-col">
        <div className="flex items-center">
          <ToastIcon
            className={iconStyle({
              variant,
            })}
          />
          <h1 className={classes.title}>{title}</h1>
        </div>
        <div>
          <h2 className={classes.description}>{description}</h2>
        </div>
      </div>
      <div>
        <button
          onClick={onClose}
          className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-[1px] hover:bg-[#EAECED] focus:bg-[#D9D9D9] focus:outline-none dark:bg-[#191919] dark:hover:bg-[#262626] dark:focus:bg-[#1F2835]">
          <X className="h-[15px] w-[12px] cursor-pointer text-[#8291C3]" />
        </button>
      </div>
    </div>
  )
}

export default ToastContent
