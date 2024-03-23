function vendorMiddleware(req, res, next) {
    if (req.user && req.user.role === "vendor") {
        next();
    } else {
        return res.status(403).json({ msg: "Forbidden: Access denied!" });
    }
}

module.exports = vendorMiddleware;
