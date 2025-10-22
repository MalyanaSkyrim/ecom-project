'use client'

import { trpc } from '@/lib/trpc/client'
import { Mail } from 'lucide-react'
import { useState } from 'react'

import { Button, Input, showToast } from '@ecom/ui'
import { classMerge } from '@ecom/ui/lib/utils'

const NewsLetterForm = ({ className }: { className?: string }) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      showToast({
        id: 'newsletter-success',
        title: data.message,
        variant: 'success',
        duration: 3000,
      })
      setEmail('')
    },
    onError: (error) => {
      showToast({
        id: 'newsletter-error',
        title: error.message || 'Failed to subscribe to newsletter',
        variant: 'error',
        duration: 3000,
      })
    },
    onSettled: () => {
      setIsSubmitting(false)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      showToast({
        id: 'newsletter-validation',
        title: 'Please enter your email address',
        variant: 'error',
        duration: 3000,
      })
      return
    }

    setIsSubmitting(true)
    subscribeMutation.mutate({ email: email.trim() })
  }

  return (
    <div
      className={classMerge(
        'flex w-[95%] flex-col gap-y-8 rounded-[20px] bg-black px-10 py-8 sm:px-12 md:mb-[-89px] md:flex-row lg:mb-[-100px] lg:px-16 lg:py-10 xl:max-w-7xl',
        className,
      )}>
      <p className="font-integralCF min-w-72 flex-[1.5] text-center text-[28px] font-bold leading-[38px] text-white sm:text-[32px] md:max-w-[400px] md:text-left lg:min-w-0 lg:max-w-none lg:flex-1 lg:text-4xl">
        STAY UPTO DATE ABOUT OUR LATEST OFFERS
      </p>
      <div className="flex flex-1 items-center justify-end text-right">
        <form onSubmit={handleSubmit} className="w-full space-y-4 lg:w-[80%]">
          <Input
            icon={Mail}
            className="h-11 rounded-full md:h-12"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            type="email"
            required
          />
          <Button
            type="submit"
            variant="secondary"
            className="h-11 w-full rounded-full md:h-12"
            disabled={isSubmitting}>
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default NewsLetterForm
