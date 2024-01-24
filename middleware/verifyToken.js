const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader,"authheader")
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log("Token from headers:", token); // Log the token
    jwt.verify('shhh', (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      console.log(user,"req.user")
      req.user = user.select('-password');
      console.log("Decoded User:", user); // Log the decoded user object
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
  }

// const verifyTokenAndAuthorization = (req, res, next) => {
//   verifyToken(req, res, () => {
//     if (req.user.id === req.params.id || req.user.isAdmin) {
//       next();
//     } else {
//       res.status(403).json("You are not alowed to do that!");
//     }
//   });
// };

// const verifyTokenAndAdmin = (req, res, next) => {
//   verifyToken(req, res, () => {
//     if (req.user.isAdmin) {
//       next();
//     } else {
//       res.status(403).json("You are not alowed to do that!");
//     }
//   });
// };

module.exports = {
  verifyToken,
//   verifyTokenAndAuthorization,
// verifyTokenAndAdmin
};