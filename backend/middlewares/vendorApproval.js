function vendorApprovalMiddleware(req, res, next) {
    if (req.user && req.user.role === "vendor" && req.user.approved) {
        next();
    } else {
        return res.status(403).json({ msg: "Forbidden: Access denied!" });
    }
}

module.exports = vendorApprovalMiddleware;
