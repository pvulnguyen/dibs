import {showNotification} from '@mantine/notifications';
import {useState} from 'react';

import type {SupabaseClient} from '@supabase/supabase-js';
import type {UserCredentials} from '../validation';

export function useSignUpWithEmail(supabase: SupabaseClient) {
  const [loading, setLoading] = useState(false);

  const signUp = async (values: UserCredentials) => {
    setLoading(true);

    const {error} = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.ENV.BASE_URL}/auth/callback`,
      },
    });

    if (error) {
      showNotification({
        message: error.message,
        color: 'red',
      });
    } else {
      showNotification({
        message: 'Please check your email for a confirmation link',
        color: 'green',
      });
    }

    setLoading(false);
  };

  return {signUp, loading};
}
