import { NextResponse } from 'next/server';

const errorHandler = (err) => {
  
  const message = err.message || 'Something went wrong';
  const statusCode = err.statusCode || 400;

  // Return the error response using NextResponse
  return NextResponse.json(
    {
      status: 'Failed',
      message,
    },
    {
      status: statusCode,
    }
  );
};

export default errorHandler;