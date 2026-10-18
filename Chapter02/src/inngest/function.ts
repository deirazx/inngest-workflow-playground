import { inngest } from "./client.js";

export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
    triggers: [{ event: "test/hello.world" }]
  },
  async ({ event, step }) => {
    console.log("Function triggeered with event", event.name);
    console.log("Event Data", event.data);

    // Step 1 Greeting
    const greeting = await step.run("create-gretting", async () => {
      const name = event.data?.name || "World"
      const message = `Hello ${name}: Welcome to inngest`
      console.log("Created greeting", message);
      return message
    })

    console.log("Waiting for 2 sec");
    await step.sleep("short-delay", "2s")

    await step.run("log-completion", async () => {
      const name = event.data?.name || "World"
      const message = `Hello ${name}: Welcome to inngest`
      console.log("Function completed succeessfully");
      return {
        completed: true,
        timeStamp: new Date().toISOString(),
        eventId: event.id,
      }
    })
  }
)

export const multiStepDemo = inngest.createFunction(
  {
    id: "multi-step-demo",
    triggers: [{ event: "demo/multistep" }]
  },
  async ({ event, step }) => {
    const step1Result = await step.run("fetch-data", async () => {
      console.log("Fetching data")
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { data: "Important Data", userId: event.data.userId }
    });
    console.log("Step 1 completed", step1Result);

    const step2Result = await step.run("process-data", async () => {
      return {
        processed: true,
        originalData: step1Result.data,
        processedAt: Date.now()
      }
    });
    console.log("Step 2 completed", step2Result);

    await step.sleep("await-before-final", "3s")

    const step3Result = await step.run("save-result", async () => {
      console.log("step: saving data...")
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return {
        saved: true,
        location: "database",
      }
    });

    return {
      message: "Multi step workflow completed",
      results: {
        step1: step1Result,
        step2: step2Result,
        step3: step3Result,

      }
    }
  }
)