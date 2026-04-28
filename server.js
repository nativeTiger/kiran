import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import session from "express-session";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const port = 3000;
const application_name = process.env.APP_NAME;

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () =>
  console.log(`[${application_name}] Redis connected`),
);

await redisClient.connect();

app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      prefix: "session:",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: false,
    },
  }),
);
app.use(express.static("dist"));

app.get("/hello", (req, res) => {
  if (!req.session.views) req.session.views = 0;
  req.session.views++;
  req.session.name = "Kiran";
  // console.log(`Hello From ${application_name}`);
  console.log(
    `[${application_name}] Views: ${req.session.views} | SessionID: ${req.sessionID}`,
  );
  res.json({
    servedBy: application_name,
    sessionId: req.session.id,
    visits: req.session.views,
  });

  // res.sendFile(__dirname + "/dist/index.html");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Could not log out" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Application is served by ${application_name}`);
});
