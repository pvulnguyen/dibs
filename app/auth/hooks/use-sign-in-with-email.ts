import {showNotification} from '@mantine/notifications';
import {useNavigate} from '@remix-run/react';
import {useState} from 'react';

import type {SupabaseClient} from '@supabase/supabase-js';
import type {UserCredentials} from '../validation';

export function useSignInWithEmail(supabase: SupabaseClient) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (values: UserCredentials) => {
    setLoading(true);

    const {error} = await supabase.auth.signInWithPassword(values);

    if (error) {
      showNotification({
        message: error.message,
        color: 'red',
      });
    } else {
      navigate('/');
    }

    setLoading(false);
  };

  return {signIn, loading};
}
