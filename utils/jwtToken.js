

export const generateToken = (user, message, starusCode, res) => {
    const token = user.generateJsonWebToken();
  
    res
      .status(starusCode)
      .cookie("token", token, {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
         httpOnly: true,
      })
      .json({
        success: true,
        message,
        token,
        user,
      });
  };
  