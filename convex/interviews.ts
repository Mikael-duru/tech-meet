import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create new interview
export const createInterview = mutation({
	args: {
		title: v.string(),
		description: v.optional(v.string()),
		startTime: v.number(),
		status: v.string(),
		streamCallId: v.string(),
		candidateId: v.string(),
		interviewerIds: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		return await ctx.db.insert("interviews", { ...args });
	},
});

// Update interview
export const updateInterview = mutation({
	args: {
		id: v.id("interviews"),
		title: v.string(),
		description: v.optional(v.string()),
		startTime: v.number(),
		candidateId: v.string(),
		interviewerIds: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		return await ctx.db.patch(args.id, {
			title: args.title,
			description: args.description,
			startTime: args.startTime,
			candidateId: args.candidateId,
			interviewerIds: args.interviewerIds,
		});
	},
});

// Delete interview
export const deleteInterview = mutation({
	args: {
		id: v.id("interviews"),
	},
	handler: async (ctx, args) => {
		return await ctx.db.delete(args.id);
	},
});

// Update interview status
export const updateInterviewStatus = mutation({
	args: {
		id: v.id("interviews"),
		status: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.patch(args.id, {
			status: args.status,
			...(args.status === "completed" ? { endTime: Date.now() } : {}),
		});
	},
});

//  Get all interviews
export const getAllInterviews = query({
	handler: async (ctx) => {
		const identity = ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Unauthorized");

		const interviews = await ctx.db.query("interviews").collect();
		return interviews;
	},
});

// Get user interviews
export const getMyInterviews = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const interviews = await ctx.db
			.query("interviews")
			.withIndex("by_candidate_id", (q) =>
				q.eq("candidateId", identity.subject)
			)
			.collect();

		return interviews!;
	},
});

// Get interview by stream call id
export const getInterviewByStreamCallId = query({
	args: {
		streamCallId: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("interviews")
			.withIndex("by_stream_call_id", (q) =>
				q.eq("streamCallId", args.streamCallId)
			)
			.first();
	},
});
