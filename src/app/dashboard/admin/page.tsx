import Signoutbutton from '@/components/signoutbutton';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const page = async () => {

  const session = await getServerSession(authOptions);
  console.log(session);

  if (session?.user){
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md">
        <h1 className="text-3xl font-bold text-center mb-6">HELLO ADMIN = {session?.user.firstname}</h1>
        <Signoutbutton/>
      </div>
    </div>
  );
}
  return <h2> Please Login to see this admin page <a href="/login/signin">Sign In</a></h2>;

};

export default page;