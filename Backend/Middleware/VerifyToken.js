const jwt = require('jsonwebtoken');

const VerifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    console.log("decoded",decoded);
    next(); 
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden' });
  }
};

module.exports = VerifyToken;

