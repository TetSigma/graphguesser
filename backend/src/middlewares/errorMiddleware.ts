import {Response} from 'express';

const errorMiddleware = (err: any, res: Response,) => {
  console.error(err); 

  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong',
    stack: err.stack || '',
  });
};

export default errorMiddleware;
