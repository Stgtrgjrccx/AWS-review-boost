import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'

const providers = [
  CredentialsProvider({
    name: 'Demo Login',
    credentials: {
      email: { label: 'Email', type: 'text', placeholder: 'demo@business.com' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      // Demo credentials login
      return {
        id: 'demo-user-1',
        name: 'Alex Rivera (Demo)',
        email: credentials?.email || 'demo@reviewboostpro.com',
        business: {
          id: 'demo-biz-1',
          name: 'The Rustic Table Café',
          slug: 'rustic-table',
          industry: 'restaurant',
          onboardingDone: true,
        },
      }
    },
  }),
]

// Add Google and Email providers if keys exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

if (process.env.EMAIL_SERVER) {
  providers.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM || 'noreply@reviewboostpro.com',
    })
  )
}

export const authOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET || 'reviewboostpro-super-secret-dev-key-987654321',
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    newUser: '/onboarding',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.business = user.business || {
          id: 'demo-biz-1',
          name: 'The Rustic Table Café',
          slug: 'rustic-table',
          industry: 'restaurant',
          onboardingDone: true,
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || 'demo-user-1'
        session.user.business = token.business || {
          id: 'demo-biz-1',
          name: 'The Rustic Table Café',
          slug: 'rustic-table',
          industry: 'restaurant',
          onboardingDone: true,
        }
      }
      return session
    },
  },
}
