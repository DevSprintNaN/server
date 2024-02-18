const isServiceAuthenticated = (req, res, next) => {
    const token = req.headers.verifyOrigin;
    if (token === process.env._TOKEN_SECRET) {
        next();
    } else {
        return res.status(401).json({error: "Unauthorized"});
    }
}

module.exports = {isServiceAuthenticated};
