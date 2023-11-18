import express from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Endpoint to handle the form submission and generate the token
app.post('/generate-token', (req, res) => {
  const { teamId, keyId, authKey, origin } = req.body;
  let { ttl } = req.body;

  if (!teamId || !keyId || !authKey) {
    return res.status(400).send('Missing mandatory parameters');
  }

  // Set default TTL to 1 year (31,536,000 seconds) if not provided
  ttl = ttl || 31536000;

  const iat = Date.now() / 1000;
  const payload = {
    iat,
    exp: iat + ttl,
    iss: teamId,
    origin,
  };

  const header = {
    typ: 'JWT',
    alg: 'ES256',
    kid: keyId,
  };

  try {
    const token = jwt.sign(payload, Buffer.from(authKey, 'base64'), { header });
    res.json({
      token,
      message: `Origin: ${origin}, expires in ${ttl} seconds.`,
    });
  } catch (error) {
    res.status(500).send('Error generating token');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the Express API
export default app;
