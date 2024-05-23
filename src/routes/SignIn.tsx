import { useCallback, useLayoutEffect, useState } from 'react';
import { createRoute, useNavigate, useRouter } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import UnAuthenticatedRoute from '@/layouts/UnAuthenticated';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { isError } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/Form';

type SignInParams = {
  redirect?: string;
}

const SignInRoute = createRoute({
  getParentRoute: () => UnAuthenticatedRoute,
  path: '/signin',
  validateSearch: (search: Record<string, unknown>): SignInParams => {
    return {
      redirect: search.redirect as string,
    }
  },
  component: SignInPage,
})

const signInSchema = z.object({
  email: z.string().min(1, {
    message: 'Please provide your email address',
  }).email({
    message: 'Please provide a valid email address',
  }),
  password: z.string().min(1, {
    message: 'Please provide your password',
  }),
});

function SignInPage() {
  const { redirect } = SignInRoute.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const { isAuthenticated, onSignInSuccess } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginRedirect = useCallback((destination: string) => {
    router.invalidate();
    navigate({
      to: destination,
      replace: true,
    });
  }, [navigate, router]);

  const form = useForm<z.infer<typeof signInSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(signInSchema),
  });

  const submit = useMutation({
    mutationFn: (values: z.infer<typeof signInSchema>) => {
      return api.signin({
        email: values.email,
        password: values.password,
      });
    },
    onMutate: () => {
      setError('');
      setIsLoading(true);
    },
    onError: (error) => {
      console.error('Error during authentication', error);

      if (isError(error)) {
        setError(error.message);
      }
    },
    onSuccess: async () => {
      onSignInSuccess(loginRedirect, '/');
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const handleSubmit = (values: z.infer<typeof signInSchema>) => {
    submit.mutate(values);
  }

  useLayoutEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (redirect) {
      router.history.push(redirect);
    } else {
      router.history.push('/');
    }
  }, [isAuthenticated, redirect, router]);

  return (
    <div>
      <h1>Sign In</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email address
                </FormLabel>
                <FormControl>
                  <input
                    autoFocus
                    placeholder='name@email.com'
                    type='email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password
                </FormLabel>
                <FormControl>
                  <input
                    autoFocus
                    placeholder='password'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            disabled={isLoading || !form.formState.isValid}
            type='submit'
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
          {error && <p>Sorry, those credentials aren't correct</p>}
        </form>
      </Form>
    </div>
  );
}

export default SignInRoute;
