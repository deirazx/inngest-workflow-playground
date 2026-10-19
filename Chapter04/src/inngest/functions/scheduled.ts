import { inngest } from "../client.js";

export const dailySalesReport = inngest.createFunction(
    {
        id: "daily-sales-report",
        name: "Daily Sales Report",
        triggers: [{ cron: "0 9 * * *" }],
    },
    async ({ step }) => {
        await step.run("fetch_sales_data", async () => {
            // Fetch sales data here
            console.log("Daily report sent")
            return { success: true };
        });
    }
);

export const abandonedCartRecovery = inngest.createFunction(
    {
        id: "abandoned-cart-recovery",
        name: "Abandoned Cart Recovery",
        triggers: [{ cron: "0 */2 * * *" }],
    },
    async ({ step }) => {
        await step.run("fetch_sales_data", async () => {
            // Fetch sales data here
            console.log("Daily report sent")
            return { success: true };
        });
    }
)