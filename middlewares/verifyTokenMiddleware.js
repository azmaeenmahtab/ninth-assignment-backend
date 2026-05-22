const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
const dotenv = require("dotenv");
dotenv.config();
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const JWKS = createRemoteJWKSet(new URL(`${baseUrl}/api/auth/jwks`));

const VerifyTokenMiddleware =  async (req, res, next) => {
    console.log('Verifying token for request:', req.method, req.url);
    const authHeader = req.headers.authorization;
    // console.log('Authorization header:', authHeader);
    if(!authHeader){
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    console.log('Extracted token:', token);
    if(!token){
        return res.status(401).json({ message: 'Token missing from Authorization header' });
    }
    try {
    const {payload} = await jwtVerify(token, JWKS)
    console.log('verification completed. Token payload:', payload);
    next();
    } catch (error) {
        console.log("Token verification failed:", error);
        return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }

   }

module.exports = VerifyTokenMiddleware;