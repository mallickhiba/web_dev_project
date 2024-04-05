function authMiddleware(req, res, next) {
    if (req.user && (req.user.role === "vendor"|| req.user.role === "admin")) {
        next();
    } else {
        return res.status(403).json({ msg: "Forbidden: Access denied!" });
    }
}

module.exports = authMiddleware;
