module.exports = (req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect(`https://localhost:${process.env.PORT_HTTPS}${req.url}`);
  }
};
