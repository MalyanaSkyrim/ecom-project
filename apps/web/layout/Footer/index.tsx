'use client'

import { useSession } from 'next-auth/react'
import React from 'react'

import {
  ApplePay,
  Facebook,
  Github,
  GooglePay,
  Instagram,
  MasterCard,
  PayPal,
  Twitter,
  Visa,
} from '@ecom/ui'
import { classMerge } from '@ecom/ui/lib/utils'

import NewsLetterForm from '../../components/Home/NewsLetterForm'

interface FooterSection {
  title: string
  links: string[]
}

interface SocialIcon {
  name: string
  element: React.FC
}

const Footer: React.FC = () => {
  const { data: session, status } = useSession()
  const isSubscribed = session?.user?.isNewsletterSubscribed || false

  // Conditional rendering of newsletter form
  const showNewsletterForm = status !== 'authenticated' || !isSubscribed

  const footerSections: FooterSection[] = [
    {
      title: 'COMPANY',
      links: ['About', 'Features', 'Works', 'Career'],
    },
    {
      title: 'HELP',
      links: [
        'Customer Support',
        'Delivery Details',
        'Terms & Conditions',
        'Privacy Policy',
      ],
    },
    {
      title: 'FAQ',
      links: ['Account', 'Manage Deliveries', 'Orders', 'Payment'],
    },
    {
      title: 'RESOURCES',
      links: [
        'Free eBook',
        'Development Tutorial',
        'How to - Blog',
        'Youtube Playlist',
      ],
    },
  ]

  const socialIcons: SocialIcon[] = [
    { name: 'Twitter', element: Twitter },
    { name: 'Facebook', element: Facebook },
    { name: 'Instagram', element: Instagram },
    { name: 'GitHub', element: Github },
  ]

  const paymentMethodsIcons = [Visa, MasterCard, PayPal, ApplePay, GooglePay]

  return (
    <footer
      className={classMerge(
        'relative bg-gray-100',
        showNewsletterForm
          ? 'xs:mt-28 xs:pt-24 mt-40 pt-32' // Full padding when form is visible
          : 'xs:mt-6 xs:pt-6 mt-8 pt-8', // Reduced padding when form is hidden
      )}>
      {showNewsletterForm && (
        <NewsLetterForm className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" />
      )}

      <div className="section_container xl:px-0">
        {/* Links Grid with Desktop Header */}
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          {/* Desktop Header (first column on desktop) */}
          <div className="w-full md:max-w-[200px] lg:max-w-[248px]">
            <h1 className="font-integralCF mb-3 text-3xl font-bold lg:text-4xl">
              SHOP.CO
            </h1>
            <p className="max-w-md text-sm text-gray-600">
              We have clothes that suits your style and which you&apos;re proud
              to wear. From women to men.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex space-x-3">
              {socialIcons.map((social) => (
                <button
                  key={social.name}
                  className={classMerge(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                    'border border-gray-300 text-gray-700 hover:bg-gray-100',
                    'hover:bg-black hover:text-white',
                  )}
                  aria-label={social.name}>
                  {<social.element />}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          <div className="grid w-full grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-x-6 lg:gap-x-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-6 text-sm font-medium tracking-[3px] text-gray-900 lg:text-base">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-600 transition-colors hover:text-gray-900 lg:text-base">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              Shop.co © 2000-2023, All Rights Reserved
            </p>

            {/* Payment Methods */}
            <div className="flex items-center space-x-3">
              {paymentMethodsIcons.map((Icon, index) => (
                <div
                  key={index}
                  className="flex h-8 w-12 items-center justify-center rounded-md border border-gray-200 bg-white px-1 text-xs font-medium text-gray-700">
                  <Icon className="h-full w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
