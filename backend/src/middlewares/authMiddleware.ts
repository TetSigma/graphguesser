import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import supabase from '../config/supabaseCLient';

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error && error.message === 'JWT expired') {
    res.status(401).json({ error: 'Token expired' });
    return;
  }

  if (error || !data || !data.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  req.user = data.user;
  next();
};
