import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
	path: "/clerk-webhook",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		// Get the webhook secret
		const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
		if (!webhookSecret) {
			throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
		}

		// Verify the svix headers
		const svix_id = request.headers.get("svix-id");
		const svix_signature = request.headers.get("svix-signature");
		const svix_timestamp = request.headers.get("svix-timestamp");
		if (!svix_id || !svix_signature || !svix_timestamp) {
			return new Response("No svix headers found", { status: 400 });
		}

		// Get the request body
		const payload = await request.json();
		const body = JSON.stringify(payload);

		// Create webhook instance
		const wh = new Webhook(webhookSecret);
		let evt: WebhookEvent;

		// Verify the webhook
		try {
			evt = wh.verify(body, {
				"svix-id": svix_id,
				"svix-timestamp": svix_timestamp,
				"svix-signature": svix_signature,
			}) as WebhookEvent;
		} catch (error) {
			console.error("Error verifying webhook", error);
			return new Response("Failed to verify webhook", { status: 400 });
		}

		// Process the event if webhook is valid
		const eventType = evt.type;

		if (eventType === "user.created") {
			const { id, email_addresses, first_name, last_name, image_url } =
				evt.data;

			const email = email_addresses[0].email_address;
			const name = `${first_name || ""} ${last_name || ""}`.trim();

			// Create the user
			try {
				await ctx.runMutation(api.users.syncUser, {
					clerkId: id,
					email,
					name,
					image: image_url,
				});
			} catch (error) {
				console.log("Error creating user", error);
				return new Response("Failed to create user", { status: 500 });
			}
		}

		return new Response("Webhook processed successfully", { status: 200 });
	}),
});

export default http;
