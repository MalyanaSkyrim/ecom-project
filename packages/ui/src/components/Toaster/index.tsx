import React from 'react'
import { useToaster } from 'react-hot-toast/headless'

import { useWindowSize } from '@ecom/ui/hooks'

import ToastItem from './ToastItem'

export const Toaster = () => {
  const { toasts, handlers } = useToaster()
  const { startPause, endPause, calculateOffset, updateHeight } = handlers
  const { width } = useWindowSize()
  const isDesktop = width && width > 868

  if (toasts.length === 0) return null

  return (
    <div
      className="xs:left-4 xs:w-[407px] xs:transform-none fixed bottom-4 left-1/2 z-[70] h-fit w-[calc(100%-32px)] -translate-x-1/2 md:left-auto md:right-5 md:top-[60px]"
      onMouseEnter={startPause}
      onMouseLeave={endPause}>
      {toasts.map((toast) => {
        const offset = calculateOffset(toast, {
          reverseOrder: !isDesktop,
          gutter: 8,
        })
        return (
          <ToastItem
            key={toast.id}
            toastItem={toast}
            offset={offset}
            updateHeight={updateHeight}
          />
        )
      })}
    </div>
  )
}

export * from './showToast'
