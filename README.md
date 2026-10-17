# pomodoro-plant-v2
A better than my first pomodoro plant project

## Running it

The server signs login tokens with a secret, and refuses to start without one:

```bash
cd server
npm install
echo "JWT_SECRET=$(openssl rand -hex 32)" > .env   # once
npm start                                          # http://localhost:5001
```

Then, in a second terminal, for the desktop window:

```bash
cd electron
npm install
npm start
```
