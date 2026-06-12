export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation error', 
      errors: Object.values(err.errors).map(e => e.message) 
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({ 
      message: 'Duplicate field value', 
      field: Object.keys(err.keyPattern)[0] 
    });
  }

  res.status(err.status || 500).json({ 
    message: err.message || 'Server error' 
  });
};
