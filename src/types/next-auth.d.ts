import NextAuth from "next-auth"

declare module "next-auth" {
  interface User{
    firstname: string
  }
  interface Session {
    user: User & {
      lastname: string
    }
    token: {
        lastname: string
    }
  }
}