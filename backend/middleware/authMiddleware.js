import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    next("Authentication failed");
    return;
  }

  const token = authHeader?.split(" ")[1];

  try {
    const userToken = JWT.verify(token, "flicksyplipsy");

    req.body.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    console.log("JWT Verification Error:", error);
    next("Authentication failed");
  }
};

export default userAuth;