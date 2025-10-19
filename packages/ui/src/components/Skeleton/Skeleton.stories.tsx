import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Skeleton } from './index'

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton.Root,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const PostExample: Story = {
  render: () => (
    <div className="max-w-lg space-y-6 p-6">
      <Skeleton.Root>
        <div className="space-y-4">
          {/* Post header with avatar and name */}
          <div className="flex items-center space-x-3">
            <Skeleton.Avatar className="h-12 w-12" />
            <div className="space-y-2">
              <Skeleton.Title className="h-4 w-24" />
              <Skeleton.Title className="h-3 w-16" />
            </div>
          </div>

          {/* Post content - responsive layout */}
          <div className="w-[80vw] space-y-4 sm:w-[400px] md:w-[600px]">
            {/* Text content - left side */}
            <div className="flex w-full flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0">
              <div className="flex-1 space-y-5">
                <Skeleton.Title className="h-6 w-32" />
                {/* Description container */}
                <div className="space-y-2">
                  <Skeleton.Row className="h-4 w-full" />
                  <Skeleton.Row className="h-4 w-full" />
                  <Skeleton.Row className="h-4 w-full" />
                </div>
              </div>
              {/* Post image - right side */}
              <Skeleton.Image className="h-64 w-full md:h-48 md:w-48" />
            </div>

            <div className="flex w-full items-center space-x-4">
              <Skeleton.Button className="h-8 w-full" />
              <Skeleton.Button className="h-8 w-full" />
            </div>
          </div>

          {/* Post actions */}
        </div>
      </Skeleton.Root>
    </div>
  ),
}
