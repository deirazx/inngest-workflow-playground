
import { inngest } from "../client.js";

export const sendWelcomeEmail = inngest.createFunction(
    {
        id: "send-welcome-email",
        name: "Send Welcome Email",
        triggers: [{ event: "user/signup.completed" }]
    },
    async ({ event, step }: any) => {
        const { email, name, plan } = event.data;

        console.log(`\n${"=".repeat(50)}`);
        console.log("WELCOME EMAIL WORKFLOW STARTED");
        console.log("====================");

        // Step 1: Prepare email content based on plan
        const emailContent = await step.run("prepare-email", async () => {
            console.log(`Preparing email for ${email} with plan ${plan}`);
            console.log("====================");

            const planBenefits: any = {
                free: "- Access to basic features\n- Community support",
                pro: "- Access to basic features\n- Community support\n- Advanced Analytics",
                enterprise: "- Access to basic features\n- Community support\n- Advanced Analytics\n- Priority Support"
            };

            return {
                to: email,
                subject: "Welcome to Our Platform!",
                body: `
Hi ${name},

Welcome to our platform! We're excited to have you on the ${plan.toUpperCase()} plan.

Here's what you get:
${planBenefits[plan] ?? planBenefits.free}

Best regards,
Inngest Team
                `.trim()
            };
        });
        console.log(`✅ Email content prepared`);

        // Step 2: Send email (simulated with delay)
        await step.run("send-email-api-call", async () => {
            console.log(`Sending email to ${emailContent.to}...`);
            console.log("===================");
            console.log(emailContent.body);
            console.log("===================");
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { status: "sent", messageId: `msg-${Date.now()}.qwe` };
        });
        console.log(`✅ Email sent successfully!`);

        // Step 3: Log event completed
        await step.run("log-email-sent", async () => {
            console.log("Loggin email send event...")
            return { status: "logged", timestamp: new Date().toISOString() };
        });
        console.log(`\n${"=".repeat(50)}`);
        console.log(`WELCOME EMAIL WORKFLOW COMPLETED`);
        console.log(`${"=".repeat(50)}`);
        return {
            status: "completed",
            emailSent: true,
            recipient: email
        };
    }
);
export const setupUserPreferences = inngest.createFunction(
    {
        id: "setup-user-preferences",
        name: "Setup User Preferences",
        triggers: [{ event: "user/signup.completed" }]
    },
    async ({ event, step }) => {
        const { userId, plan, email } = event.data;

        console.log(`\n${"=".repeat(50)}`);
        console.log(`⚙️  USER PREFERENCES WORKFLOW STARTED`);
        console.log(`${"=".repeat(50)}`);

        // Step 1: Create default preferences
        const preferences = await step.run("create-preferences", async () => {
            console.log(`🔧 Creating preferences for user ${userId}`);

            const defaultPreferences = {
                userId,
                notifications: {
                    email: true,
                    push: plan !== "free", // Only pro/enterprise get push
                    sms: plan === "enterprise",
                },
                newsletter: plan !== "free",
                theme: "light",
                language: "en",
                timezone: "UTC",
            };

            // Simulate database write
            await new Promise((resolve) => setTimeout(resolve, 500));

            // In real app:
            // await db.preferences.create(defaultPreferences);

            console.log(`✅ Preferences created:`, defaultPreferences);

            return defaultPreferences;
        });

        // Step 2: Send preferences confirmation email (only for pro/enterprise)
        if (plan !== "free") {
            await step.run("send-preferences-email", async () => {
                console.log(`📧 Sending preferences confirmation to ${email}`);

                await new Promise((resolve) => setTimeout(resolve, 800));

                console.log(`✅ Preferences email sent`);
            });
        }

        console.log(`${"=".repeat(50)}`);
        console.log(`✅ USER PREFERENCES WORKFLOW COMPLETED`);
        console.log(`${"=".repeat(50)}\n`);

        return {
            success: true,
            preferencesSetup: true,
            preferences,
        };
    }
);


export const trackSignupAnalytics = inngest.createFunction(
    {
        id: "track-signup-analytics",
        name: "Track Signup Analytics",
        triggers: [{ event: "user/signup.completed" }]
    },
    async ({ event, step }) => {
        const { userId, plan, signupDate } = event.data;

        console.log(`\n${"=".repeat(50)}`);
        console.log(`📊 ANALYTICS WORKFLOW STARTED`);
        console.log(`${"=".repeat(50)}`);

        await step.run("send-to-analytics", async () => {
            console.log(`📈 Tracking signup event for user ${userId}`);

            const analyticsData = {
                event: "user_signup",
                userId,
                properties: {
                    plan,
                    signupDate,
                    source: "web",
                    timestamp: new Date().toISOString(),
                },
            };

            // Simulate analytics API call
            await new Promise((resolve) => setTimeout(resolve, 700));

            // In real app:
            // await analytics.track(analyticsData);

            console.log(`✅ Analytics tracked:`, analyticsData);

            return analyticsData;
        });

        // Step 2: Update metrics dashboard
        await step.run("update-metrics", async () => {
            console.log(`📊 Updating real-time metrics...`);

            await new Promise((resolve) => setTimeout(resolve, 300));

            // In real app:
            // await metricsService.increment('signups', { plan });

            console.log(`✅ Metrics updated`);
        });

        console.log(`${"=".repeat(50)}`);
        console.log(`✅ ANALYTICS WORKFLOW COMPLETED`);
        console.log(`${"=".repeat(50)}\n`);

        return {
            success: true,
            tracked: true,
        };
    }
);