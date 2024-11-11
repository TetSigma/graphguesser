import { Request, Response } from 'express';
import supabase from '../config/supabaseCLient';
import authService from '../services/authService';


// Refresh access token using refresh token
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

    if (error || !data.session) {
      throw new Error('Failed to refresh session');
    }

    const { access_token, user } = data.session;

    res.status(200).json({ access_token, user });
  } catch (err) {
    const errorMessage = (err as Error).message || 'Failed to refresh session';
    res.status(401).json({ error: errorMessage });
  }
};


// Sign up a new user
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await authService.signup(email, password);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Log in an existing user
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const session = await authService.login(email, password);
    res.status(200).json({ message: 'Login successful', session });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

// Log out the current user
export const logout = async (_: Request, res: Response): Promise<void> => {
  try {
    await authService.logout();
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Check if a user session exists
export const getSession = async (_: Request, res: Response): Promise<void> => {
  try {
    const { session } = await authService.getSession(); 
    res.status(200).json({ session });  
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
