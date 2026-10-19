import express from "express";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import {
    dailySalesReport,
    abandonedCartRecovery,
} from "./inngest/functions/scheduled.js";

const app = express();
const port = 8000;

app.use(express.json({ limit: "4mb" }));

app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions: [dailySalesReport, abandonedCartRecovery],
    })
);

app.get("/", (req, res) => {
    res.json({
        status: "healthy",
        message: "Scheduled Jobs App with Inngest",
        endpoints: {
            inngest: "/api/inngest",
        },
    });
});

app.listen(port, () => {
    console.log(`Server is running at: http://localhost:${port}`);
});
