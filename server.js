import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import session from "express-session";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const port = 3000;
const application_name = process.env.APP_NAME;

app.use(
  session({
    secret: "CbNlR_B1paqnhwA7VIcaaub0YZW13i-6O-0pIqtDfLvYq3Tn6MTNj9uutTDuBIiw",
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
  // console.log(`Hello From ${application_name}`);
  console.log(
    `[${application_name}] Views: ${req.session.views} | SessionID: ${req.sessionID}`,
  );
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Application is served by ${application_name}`);
});
