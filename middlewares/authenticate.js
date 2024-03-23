const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    try {
        const token = req.headers.authorization;
        const user = jwt.verify(token.split(" ")[1], "MY_SECRET");
        req.user = user;
        next();
    } catch (e) {
        return res.json({ msg: "TOKEN NOT FOUND / INVALID. PLEASE LOG IN " });
    }
}
module.exports = authenticate;