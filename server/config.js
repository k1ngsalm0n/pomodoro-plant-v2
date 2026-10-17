// The secret used to be the string 'your_secret_key', written out twice — in
// routes/auth.js where tokens are signed and in middleware/auth.js where they
// are verified. Anyone reading the repo could sign a token for any user id.
// It is read from the environment now, in one place so the two sides cannot
// disagree: a secret that differs between them signs tokens nobody can verify.
const JWT_SECRET = process.env.JWT_SECRET

// Refuse to start rather than fall back to a default, which would be a
// published secret again the moment someone forgot to set this one.
if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set. Make one and put it in server/.env:')
    console.error('  echo "JWT_SECRET=$(openssl rand -hex 32)" > .env')
    process.exit(1)
}

module.exports = { JWT_SECRET }
