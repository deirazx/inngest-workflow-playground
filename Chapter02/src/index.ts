import express from "express";
import { inngest } from "./inngest/client.js";
import { serve } from "inngest/express";
import { helloWorld, multiStepDemo } from "./inngest/function.js";

const app = express();
const port = 8000;

app.use(express.json({ limit: "4mb" }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/inngest", serve({
  client: inngest,
  functions: [
    helloWorld,
    multiStepDemo
  ]
}));

app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    message: "Express + Inngest server running",
    endpoints: {
      inngest: "/api/inngest",
      test: "/test",
      testmulti: "/test-multi"
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at: ${port} port`);
});