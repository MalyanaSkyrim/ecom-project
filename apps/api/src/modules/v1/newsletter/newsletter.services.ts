import { db } from '@ecom/database'

import type { NewsletterSubscriptionInput } from './newsletter.schema'

export const subscribeToNewsletter = async (
  storeId: string,
  data: NewsletterSubscriptionInput,
) => {
  // Check if customer already exists
  const existingCustomer = await db.customer.findUnique({
    where: {
      storeId_email: {
        storeId,
        email: data.email,
      },
    },
  })

  if (existingCustomer) {
    // Update existing customer's newsletter subscription
    const updatedCustomer = await db.customer.update({
      where: { id: existingCustomer.id },
      data: {
        isNewsletterSubscribed: true,
      },
    })
    return {
      success: true,
      message: 'Successfully subscribed to newsletter!',
      isSubscribed: true,
    }
  } else {
    // Create new customer with newsletter subscription
    const newCustomer = await db.customer.create({
      data: {
        storeId,
        email: data.email,
        isNewsletterSubscribed: true,
      },
    })
    return {
      success: true,
      message: 'Successfully subscribed to newsletter!',
      isSubscribed: true,
    }
  }
}
