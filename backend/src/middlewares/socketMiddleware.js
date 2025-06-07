const socketMiddleware = (ioInstance) => {
  return (req, res, next) => {
    req.io = ioInstance;
    next();
  };
};

export default socketMiddleware;
