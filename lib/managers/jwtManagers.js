const jwt = require("jsonwebtoken");

const getJwtToken = (user) => {
  const accessToken = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return accessToken;
};

module.exports = getJwtToken
