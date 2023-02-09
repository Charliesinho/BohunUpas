const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/auth/accountcheck");
    }
    next();
}

const isLoggedOut = (req, res, next) => {
    if (req.session.user) {
        return res.redirect("/user/profile");
    }
    next();
}

module.exports = {
    isLoggedIn,
    isLoggedOut
};