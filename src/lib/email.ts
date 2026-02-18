
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'onboarding@resend.dev'; // Use 'onboarding@resend.dev' for testing without domain

export const EmailService = {
    sendWelcomeEmail: async (email: string, name: string) => {
        if (!process.env.RESEND_API_KEY) {
            console.log("Mock Email Sent (Welcome):", { email, name });
            return;
        }

        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: email,
                subject: 'Welcome to Nexus Gym SaaS',
                html: `
                    <h1>Welcome, ${name}!</h1>
                    <p>We're thrilled to have you onboard.</p>
                    <p>Get started by setting up your gym profile.</p>
                `
            });
        } catch (error) {
            console.error("Failed to send welcome email", error);
        }
    },

    sendInvitationEmail: async (email: string, inviteLink: string, gymName: string) => {
        if (!process.env.RESEND_API_KEY) {
            console.log("Mock Email Sent (Invite):", { email, inviteLink });
            return;
        }

        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: email,
                subject: `You've been invited to join ${gymName}`,
                html: `
                    <h1>Join ${gymName} on Nexus</h1>
                    <p>Click the link below to accept your invitation:</p>
                    <a href="${inviteLink}">${inviteLink}</a>
                `
            });
        } catch (error) {
            console.error("Failed to send invitation email", error);
        }
    }
};
