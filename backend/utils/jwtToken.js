export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken();
  
    // Log the environment variable to see if it's correctly loaded
    // console.log("COOKIE_EXPIRE value:", process.env.COOKIE_EXPIRE);
  
    // Fallback to 7 days if COOKIE_EXPIRE is not set or invalid
    const expiresIn = (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000;
  
    // console.log("expiresIn:", expiresIn); 
  
    const options = {
      expires: new Date(Date.now() + expiresIn),
      httpOnly: true,
    };
  
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user,
      message,
      token,
    });
  };
  