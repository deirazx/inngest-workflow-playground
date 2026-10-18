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