import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mi-destino-api.onrender.com/api/v1'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Al hacer login con Google, intercambiamos el id_token por un JWT del backend
      if (account?.provider === 'google' && account.id_token) {
        try {
          const res = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_token: account.id_token }),
          })
          const data = await res.json()
          if (data.accessToken) {
            token.backendToken = data.accessToken
            token.backendUser = data.usuario
          }
        } catch (err) {
          console.error('Error conectando con backend:', err)
        }
      }
      return token
    },
    async session({ session, token }) {
      // Pasar el token del backend a la sesión
      session.backendToken = token.backendToken as string
      session.backendUser = token.backendUser
      return session
    },
  },
})

export { handler as GET, handler as POST }
