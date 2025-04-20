import React from 'react'
import { toast, Toast } from 'react-hot-toast/headless'

import ToastContent, { type ToastContentProps } from './ToastContent'

interface ToastParams extends Omit<ToastContentProps, 'onClick' | 'className'> {
  id: string
  duration?: Toast['duration']
  ariaProps?: Toast['ariaProps']
}

export const showToast = ({
  duration,
  ariaProps,
  id,
  ...props
}: ToastParams) => {
  toast(<ToastContent {...props} onClose={() => toast.dismiss(id)} />, {
    id,
    duration,
    ariaProps,
  })
}
