import { BaseError, BaseErrorOptions } from '../base'

export class NewsletterSubscriptionFailedError extends BaseError {
  constructor(options?: BaseErrorOptions) {
    super('NEWSLETTER_SUBSCRIPTION_FAILED', options)
  }
}
