// ERROR MIDDLEWARE | NEXT FUNCTION

const errorMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: 404,
    success: false,
    message: err,
  };

  if (err?.name === "ValidationError") {
    defaultError.statusCode = 400;
    defaultError.message = Object.values(err.errors || {})
      .map((el) => el.message)
      .join(",");
  }

  //duplicate error
  if (err.code && err.code === 11000) {
    defaultError.statusCode = 400;
    defaultError.message = `${Object.keys(err.keyValue).join(", ")} already exists!`;
  }

  res.status(defaultError.statusCode).json({
    success: defaultError.success,
    message: defaultError.message,
  });
};

export default errorMiddleware;