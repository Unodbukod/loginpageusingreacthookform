import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login/signin',
      },
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            email: { label: "Email", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
              console.error('Credentials are missing or incomplete.');
              return null;
            }
          
            console.log('Received credentials:', credentials);
          
            const existingUser = await db.user.findUnique({
              where: { email: credentials.email }
            });
          
            console.log('Existing user:', existingUser);
          
            if (!existingUser) {
              console.log('User not found.');
              return null;
            }
          
            const passwordMatch = await compare(credentials.password, existingUser.password);
          
            if (!passwordMatch) {
              console.log('Password does not match.');
              return null;
            }
          
            console.log('Authentication successful.');
          
            return {
              id: existingUser.id.toString(),
              firstname: existingUser.firstname,
              email: existingUser.email
            };
          }
        })
      ],
      callbacks: {
        async jwt({ token, user }) {
          console.log(token, user);
          if(user){
            return {
              ...token,
              firstname: user.firstname
            }
          }
          return token
        },
        async session({ session, token }) {
          return {
            ...session,
            user: {
              ...session.user,
              firstname: token.firstname
            }
          }
        },
      }

      }
