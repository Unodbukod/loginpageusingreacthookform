'use client'
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm , SubmitHandler } from 'react-hook-form';
import {z} from "zod";
import { useRouter } from 'next/navigation';

const schema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    confirmpassword: z.string().min(8),
})

type FormFields = z.infer<typeof schema>;
const SignUpPage = () => {
    const { register, handleSubmit, setError, formState: {errors}} = useForm<FormFields>({
        defaultValues: {
            email: "test@gmail.com",
        },
        resolver: zodResolver(schema),
    });
    const router = useRouter();

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            if (!data.firstname){
                setError('firstname', { message: 'Firstname is empty' });
                return;
            }
            if (!data.lastname){
                setError('lastname', { message: 'Lastname is empty' });
                return;
            }
            if (data.password !== data.confirmpassword) {
                setError('confirmpassword', { message: 'Passwords do not match' });
                return;
            }
            // Make a POST request to your server
            const response = await axios.post('/api/user', {
                ...data,
                confirmpassword: data.password,
            });
            if (response.status === 201) {
                // Clear any previous errors
                setError('root', { message: 'User created successfully' });
                // Do something with the successful response (e.g., show success message)
                router.push('/login/signin');
                console.log('Account created successfully:', response.data);
                alert('Account created successfully');
              }
          } catch (error: any) {
            if (error.response && error.response.status === 409) {
              // Handle conflict (user with the same email already exists) error
              setError('email', { message: error.response.data.message }); // Set error for the 'email' field
              console.error('Email already exists:', error.response.data.message);
            } else if (error.response.status === 400) {
                // Handle other validation errors
                setError('root', { message: error.response.data.message });
                console.error('', error.response.data.message);
              } else {
                // Handle other network errors or issues
                setError('root', { message: 'Failed to create an account.' });
                console.error('Error creating account:', error);
              }
            }
    };

  return (
    <div>
        <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstname")} type="text" placeholder="First name" />
      <input {...register("lastname")} type="text" placeholder="Last name"/>
      <input {...register("email")} type="text" placeholder="Email"/>
      <input {...register("password")} type="password" placeholder="Password" />
      <input {...register("confirmpassword")} type="password" placeholder="Confirm Password" />
      <button  type='submit'>Submit</button>
      {errors.firstname && (<div>{errors.firstname.message}</div>)}
      {errors.lastname && (<div>{errors.lastname.message}</div>)}
      {errors.email && (<div>{errors.email.message}</div>)}
      {errors.password && (<div>{errors.password.message}</div>)}
      {errors.confirmpassword && (<div>{errors.confirmpassword.message}</div>)}
      {errors.root && (<div>{errors.root.message}</div>)}

    </form>
    </div>
  );
};

export default SignUpPage;