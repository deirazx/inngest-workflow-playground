import express from "express";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";

import {
    sendWelcomeEmail,
    setupUserPreferences,
    trackSignupAnalytics,
} from "./inngest/functions/user.signup.js";

const app = express();
const port = 8000;

app.use(express.json({ limit: "4mb" }));

app.use((req, res, next) => {
    console.log(`Inngest Middleware: ${req.method} ${req.url}`);
    next();
});

app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions: [
            sendWelcomeEmail,
            setupUserPreferences,
            trackSignupAnalytics,
        ],
    })
);

interface User {
    id: string;
    email: string;
    name: string;
    password: string;
    plan: "free" | "pro" | "enterprise";
    createdAt: string;
}

const users: User[] = [];

app.get("/", (req, res) => {
    res.json({
        status: "healthy",
        message: "User Signup System with Inngest",
        endpoints: {
            signup: "POST /api/signup",
            users: "GET /api/users",
            inngest: "/api/inngest",
        },
        stats: {
            totalUsers: users.length,
            usersByPlan: {
                free: users.filter((u) => u.plan === "free").length,
                pro: users.filter((u) => u.plan === "pro").length,
                enterprise: users.filter((u) => u.plan === "enterprise").length,
            },
        },
    });
});

app.listen(port, () => {
    console.log(`Server is running at: http://localhost:${port}`);
});