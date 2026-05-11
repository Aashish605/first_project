import jwt from 'jsonwebtoken'

export function verifyToken(req, res, next) {
    try {
        const { accessToken } = req.cookies ?? {}
        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired access token' })
            }
            req.user = decoded
            return next()
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error verifying token', error: error.message })
    }
}

