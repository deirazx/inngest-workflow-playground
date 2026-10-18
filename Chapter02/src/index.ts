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

app.post("/test", async (req, res) => {
  try {
    console.log("Sending test event");
    const { ids } = await inngest.send({
      name: "test/hello.world",
      data: {
        name: req.body.name || "World",
        timeStamp: new Date().toISOString()
      }
    });

    console.log("Event send with ID", ids[0]);

    res.json({
      message: "Event send successfully",
      eventId: ids[0],
      tip: "check http://localhost:8288/runs to see function execution"
    });
  } catch (error) {
    console.error("Error sending event:", error);
    res.status(500).json({
      error: "Failed to send event",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at: ${port} port`);
});