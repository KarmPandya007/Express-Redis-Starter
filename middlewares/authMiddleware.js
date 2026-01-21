import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer ")
    ) {
        return res.status(401).json({
            message: "No token, access denied",
        });
    }

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token is not valid",
        });
    }
};
