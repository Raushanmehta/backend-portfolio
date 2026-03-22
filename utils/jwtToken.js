export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Required for cross-site in production
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};
  