const jwt = require('jsonwebtoken');



function userMiddleware(req, res, next) {
    // Implement user auth logic
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({
            message : "Access denied. No token provided or invalid format."
        })
    }

    const token = authHeader.substring(7);// Remove bearer prefix
    if (blacklistedToken.has(token)){
        return res.status(401).json({
            message : "Token has been invalidated"
        });
    }

    try{
        const decoded = jwt.verify(token,"todo");
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({
            message : "Invalid token"
        })
    }
    
}

module.exports = userMiddleware;