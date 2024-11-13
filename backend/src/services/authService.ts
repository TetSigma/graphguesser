import supabase from "../config/supabaseCLient";

interface AuthResponse {
  user: any | null;
  session: any | null;
}

// Refresh session with access token, user name, surname, profile photo, and rating
export const refreshSession = async (refreshToken: string) => {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    throw new Error("Failed to refresh session");
  }

  const { access_token, user } = data.session;

  // Fetch user profile data (name, surname, profile_photo, rating)
  const { data: profileData, error: profileError } = await supabase
    .from("users")
    .select("name, surname, profile_photo, rating")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw new Error("Failed to fetch user profile");
  }

  const userWithProfile = {
    ...user,
    name: profileData?.name || "",
    surname: profileData?.surname || "",
    profile_photo: profileData?.profile_photo || "",
    rating: profileData?.rating || 0,
  };

  return { access_token, user: userWithProfile };
};

// Sign up a new user with default rating of 0
export const signup = async (
  email: string,
  password: string,
  name: string,
  surname: string,
  profilePhoto: string
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw new Error("Error signing up: " + error.message);

  const userId = data.user?.id;

  if (userId) {
    const { error: updateError } = await supabase.from("users").upsert({
      id: userId,
      email,
      name,
      surname,
      profile_photo: profilePhoto,
      rating: 0,
    });

    if (updateError)
      throw new Error("Error updating user profile: " + updateError.message);
  }

  return data;
};

// Log in an existing user with rating included
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  if (
    !data.session ||
    !data.session.access_token ||
    !data.session.refresh_token
  ) {
    throw new Error("Failed to retrieve session tokens");
  }

  const { user } = data;

  // Fetch user profile data (name, surname, profile_photo, rating)
  const { data: profileData, error: profileError } = await supabase
    .from("users")
    .select("name, surname, profile_photo, rating")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw new Error("Failed to fetch user profile");
  }

  const userWithProfile = {
    ...user,
    name: profileData?.name || "",
    surname: profileData?.surname || "",
    profile_photo: profileData?.profile_photo || "",
    rating: profileData?.rating || 0,
  };

  return { session: data.session, user: userWithProfile };
};

// Log out the current user
export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error("Error logging out: " + error.message);
};

// Check if a user session exists
export const getSession = async (): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error("Error retrieving session: " + error.message);

  if (data.session?.user) {
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .select("name, surname, profile_photo, email, rating")
      .eq("id", data.session.user.id)
      .single();

    if (profileError)
      throw new Error("Error retrieving profile: " + profileError.message);

    return {
      user: { ...data.session.user, ...profileData },
      session: data.session,
    };
  }

  return {
    user: data.session?.user || null,
    session: data.session || null,
  };
};

export default { signup, login, logout, getSession, refreshSession };
