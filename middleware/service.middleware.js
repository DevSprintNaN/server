const isServiceAuthenticated = (req, res, next) => {
    const allowedOrigins = process.env._MESSAGING_SERVER;

    const origin = req.headers.origin;
    console.log(origin);
    if (origin===allowedOrigins) {
        next();
    } else {
        return res.status(401).json({error: "Unauthorized"});
    }
}

module.exports = {isServiceAuthenticated};
