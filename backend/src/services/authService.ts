import supabase from '../config/supabaseCLient'

interface AuthResponse {
  user: any;
  session: any;
}


export const refreshSession = async (refreshToken: string) => {
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

  if (error) throw error;
  return data.session;
};


// Sign up a new user
export const signup = async (email: string, password: string): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  
  if (error) throw new Error('Error signing up: ' + error.message);
  return data;
};

// Log in an existing user
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error(error.message);

  if (!data.session || !data.session.access_token || !data.session.refresh_token) {
    throw new Error('Failed to retrieve session tokens');
  }

  return data.session;
};

// Log out the current user
export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error('Error logging out: ' + error.message);
};

interface AuthResponse {
  user: any | null; 
  session: any | null;
}

// Check if a user session exists
export const getSession = async (): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error('Error retrieving session: ' + error.message);

  return {
    user: data.session?.user || null,
    session: data.session || null,
  };
};


export default { signup, login, logout, getSession };
