const SafeAsync = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await Promise.resolve(requestHandler(req, res, next));
    } catch (err) {
      if (err.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next(err);
    }
  };
};

export { SafeAsync };
