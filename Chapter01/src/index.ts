import { Inngest } from "inngest";

const inngest = new Inngest({ id: "hello-world-app" });

const helloFunction = inngest.createFunction(
  {
    id: "hello-world",
    triggers: [{ event: "test/hello" }]
  },
  async ({ event, step }) => {
    console.log("Hello from Inngest");
    console.log("Event received:", event.name);
    console.log("Event data:", event.data);

    return {
      message: `Hello ${event.data?.name || "world"}`,
      receivedAt: new Date().toISOString(),
    }
  }
)

console.log("✅ function created", helloFunction.id());

const multiStepFunction = inngest.createFunction(
  {
    id: "multi-step-demo",
    triggers: [{ event: "demo/multistep" }]
  },
  async ({ event, step }) => {
    // Step 1: First task
    const result1 = await step.run("step-1", async () => {
      console.log("Executing step 1...");
      return { data: "Result from step 1" }
    })
    console.log("Step 1 completed", result1);

    // Step 2: Sleep for 5 seconds

    await step.sleep("await-a-bit", "5s")
    console.log("Step 2 completed");

    // Step 3: Another task
    const resul2 = await step.run("step-3", async () => {
      console.log("Executing step 3...");
      return { data: "Result from step 2", previous: result1 };
    })
    console.log("Step 3 completed", resul2);

    return {
      message: "Multi step workflow completed",
      results: [result1, resul2]
    }
  }
)

console.log("✅ Multi step function created: ", multiStepFunction.id());