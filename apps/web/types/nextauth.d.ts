import { DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar: string
    isNewsletterSubscribed?: boolean
  }

  interface Session {
    user: User
  }
}
