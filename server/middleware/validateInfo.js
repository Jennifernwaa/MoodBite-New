module.exports = (req, res, next) => {
  const { username, email, phone_number, password } = req.body;

  //   if (req.path === "/register") {
  //     if (![firstname, lastname,  email, phone, password].every(Boolean)) {
  //       return res.status(400).json({
  //         error: "Missing credentials",
  //       });
  //     }
  //   }

  if (req.path === "/register") {
    if (!username || !email || !phone_number || !password) {
      return res.status(400).json({
        error: "Missing credentials",
      });
    }
  }

  if (req.path === "/login") {
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing credentials",
      });
    }
  }
  next();
};