import AppError from "../utils/appError.js";

export default (...role) => (req, res, next) => {
  // console.log(role);
  
    if (!req.user || !role.includes(req.user.role)) {
      return next(new AppError("Permission denied.", 403));
    }
    next();
  };
  