module.exports = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(403).json({ message: "no access" });
};
