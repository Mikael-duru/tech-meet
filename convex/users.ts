import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
	args: {
		clerkId: v.string(),
		name: v.string(),
		email: v.string(),
		image: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const existingUser = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("clerkId"), args.clerkId))
			.first();

		if (existingUser) return;

		return await ctx.db.insert("users", {
			...args,
			role: "candidate",
		});
	},
});

// // Update user role
// export const updateUserRole = mutation({
// 	args: {
// 		id: v.id("users"),
// 		role: v.union(v.literal("candidate"), v.literal("interviewer"),),
// 	},
// 	handler: async (ctx, args) => {
// 		return await ctx.db.patch(args.id, {
// 			role: args.role,
// 		});
// 	},
// });

export const getUsers = query({
	handler: async (ctx) => {
		// Check if the user is authenticated
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const users = await ctx.db.query("users").collect();
		return users;
	},
});

export const getUserByClerkId = query({
	args: {
		clerkId: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
			.first();

		return user;
	},
});
