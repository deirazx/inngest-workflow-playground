import express from "express";

const app = express();
const port = 8000;

app.use(express.json({ limit: "4mb" }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

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