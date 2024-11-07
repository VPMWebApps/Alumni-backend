export default function (err, req, res, next) {
    err.statusCode ||= 500;
    err.message ||= "Internal server error";
    err.status ||= "error";

    console.log(err.statusCode);
    
    res.status(err.message).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });

}