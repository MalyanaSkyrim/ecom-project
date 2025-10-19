'use client'

import React, { createContext, useContext } from 'react'

import { classMerge } from '../../lib/utils'

// Context for validation
const SkeletonContext = createContext<boolean | null>(null)

// Hook to check if component is used within Root
const useSkeletonContext = () => {
  const context = useContext(SkeletonContext)
  if (!context) {
    throw new Error('Skeleton components must be used within Skeleton.Root')
  }
  return context
}

// Root component - provides context and animate-pulse
interface SkeletonRootProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const SkeletonRoot = ({ children, className, style }: SkeletonRootProps) => {
  return (
    <SkeletonContext.Provider value={true}>
      <div className={classMerge('animate-pulse', className)} style={style}>
        {children}
      </div>
    </SkeletonContext.Provider>
  )
}

// Title component
interface SkeletonTitleProps {
  className?: string
}

const SkeletonTitle = ({ className }: SkeletonTitleProps) => {
  useSkeletonContext()

  return <div className={classMerge('h-4 rounded-md bg-gray-200', className)} />
}

// Input component
interface SkeletonInputProps {
  className?: string
}

const SkeletonInput = ({ className }: SkeletonInputProps) => {
  useSkeletonContext()

  return (
    <div className={classMerge('h-10 rounded-md bg-gray-200', className)} />
  )
}

// Image component with fallback icon
interface SkeletonImageProps {
  className?: string
}

const SkeletonImage = ({ className }: SkeletonImageProps) => {
  useSkeletonContext()

  return (
    <div
      className={classMerge(
        'flex min-h-[200px] min-w-[200px] items-center justify-center rounded-md bg-gray-200 p-8',
        className,
      )}>
      {/* Fallback icon - geometric shapes: triangle on top, circle and square on bottom */}
      <div className="flex flex-col items-center justify-center space-y-2">
        {/* Triangle on top */}
        <div className="h-0 w-0 border-b-[32px] border-l-[20px] border-r-[20px] border-b-gray-400 border-l-transparent border-r-transparent" />
        {/* Circle and square on bottom */}
        <div className="flex items-center space-x-2">
          {/* Circle */}
          <div className="h-10 w-10 rounded-full bg-gray-400" />
          {/* Square */}
          <div className="h-10 w-10 bg-gray-400" />
        </div>
      </div>
    </div>
  )
}

// Row component - full width
interface SkeletonRowProps {
  className?: string
}

const SkeletonRow = ({ className }: SkeletonRowProps) => {
  useSkeletonContext()

  return (
    <div
      className={classMerge('h-4 w-full rounded-md bg-gray-200', className)}
    />
  )
}

// Avatar component - smaller and rounded by default
interface SkeletonAvatarProps {
  className?: string
}

const SkeletonAvatar = ({ className }: SkeletonAvatarProps) => {
  useSkeletonContext()

  return (
    <div
      className={classMerge(
        'flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-gray-200',
        className,
      )}>
      {/* Simple circle icon for avatar */}
      <div className="h-6 w-6 rounded-full bg-gray-400" />
    </div>
  )
}

// Button component - darker variant
interface SkeletonButtonProps {
  className?: string
}

const SkeletonButton = ({ className }: SkeletonButtonProps) => {
  useSkeletonContext()

  return <div className={classMerge('h-8 rounded-md bg-gray-300', className)} />
}

// Export compound component
export const Skeleton = {
  Root: SkeletonRoot,
  Title: SkeletonTitle,
  Input: SkeletonInput,
  Image: SkeletonImage,
  Avatar: SkeletonAvatar,
  Row: SkeletonRow,
  Button: SkeletonButton,
}
