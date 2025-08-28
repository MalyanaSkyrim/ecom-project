'use client'

import { useAnimate } from 'motion/react'
import React, { useCallback, useEffect } from 'react'
import { Toast } from 'react-hot-toast/headless'

import { useWindowSize } from '@ecom/ui/hooks'
import { classMerge } from '@ecom/ui/lib/utils'

interface Props {
  toastItem: Toast
  offset: number
  updateHeight: (toastId: string, height: number) => void
}

const ToastItem = ({ toastItem, offset, updateHeight }: Props) => {
  const [scope, animate] = useAnimate()
  const { width } = useWindowSize()
  const isDesktop = width && width > 868

  const animateOnEnter = useCallback(() => {
    const height = scope.current.getBoundingClientRect().height
    animate(
      scope.current,
      isDesktop
        ? { translateX: '-100%', opacity: 1 }
        : { translateX: 0, translateY: -(offset + height), opacity: 1 },
      {
        duration: 0.8,
        stiffness: 68,
        damping: 15,
        mass: 1,
        type: 'spring',
      },
    )
  }, [animate, isDesktop, offset, scope])

  const animateOnLeave = useCallback(() => {
    animate(
      scope.current,
      isDesktop
        ? { translateX: 0, opacity: 0 }
        : {
            translateY: -offset,
            opacity: 0,
          },
      { duration: 0.2 },
    )
  }, [animate, isDesktop, offset, scope])

  const animateOnOffsetChange = useCallback(() => {
    animate(
      scope.current,
      {
        translateY: offset,
      },
      {
        duration: 0.3,
      },
    )
  }, [animate, offset, scope])

  useEffect(() => {
    if (isDesktop) {
      animateOnOffsetChange()
    }

    if (toastItem.visible) {
      animateOnEnter()
    } else {
      animateOnLeave()
    }
  }, [
    animateOnEnter,
    animateOnLeave,
    animateOnOffsetChange,
    isDesktop,
    toastItem.visible,
  ])

  const ref = (el: HTMLDivElement) => {
    if (el && typeof toastItem.height !== 'number') {
      const height = el.getBoundingClientRect().height
      updateHeight(toastItem.id, height)
    }
  }

  return (
    <div
      ref={scope}
      style={{
        right: isDesktop ? '-100%' : 0,
        opacity: 0,
      }}
      className={classMerge(`absolute w-full`)}>
      <div ref={ref}>
        {typeof toastItem.message === 'function'
          ? toastItem.message(toastItem)
          : toastItem.message}
      </div>
    </div>
  )
}

export default ToastItem
