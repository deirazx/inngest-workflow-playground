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