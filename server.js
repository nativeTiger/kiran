import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const port = 3000;
const application_name = process.env.APP_NAME;

app.use(express.static("dist"));

app.get("/hello", (req, res) => {
  console.log(`Hello From ${application_name}`);
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Application is served by ${application_name}`);
});
