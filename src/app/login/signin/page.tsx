'use client'

import { useForm, SubmitHandler } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';  // Fix import statement

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormFields = z.infer<typeof schema>;

const SignInPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({
    defaultValues: {
      email: '',
    },
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<FormFields> = async ({ email, password }) => {
    try {
      const signInData = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInData?.error) {
        console.error(signInData.error);
        alert('Login failed. Please check your credentials and try again.');
      } else {
        // Successful login
        router.push('/dashboard/admin');
        alert('Login successful!');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      alert('An unexpected error occurred during login. Please try again later.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email')} type="text" placeholder="Email" />
        <input {...register('password')} type="password" placeholder="Password" />
        <button type="submit">Submit</button>
        {errors.email && <div>{errors.email.message}</div>}
        {errors.password && <div>{errors.password.message}</div>}
      </form>
      <a href="/login/signup">CREATE ACCOUNT</a>
    </div>
  );
};

export default SignInPage;