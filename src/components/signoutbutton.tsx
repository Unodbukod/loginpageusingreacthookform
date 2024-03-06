'use client'
import { signOut } from "next-auth/react";

const SignoutButton = () => {
  return <button onClick={() => signOut()}>Sign out</button>;
};

export default SignoutButton;