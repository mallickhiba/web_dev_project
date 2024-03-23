function customerMiddleware(req, res, next) {
    if (req.user && req.user.role === "customer") {
        next();
    } else {
        return res.status(403).json({ msg: "Forbidden: Access denied!" });
    }
}

module.exports = customerMiddleware;
