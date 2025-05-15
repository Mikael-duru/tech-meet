import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const UseUserRole = () => {
	const { user } = useUser();

	const userData = useQuery(api.users.getUserByClerkId, {
		clerkId: user?.id || "",
	});

	const isLoading = userData === undefined;

	return {
		isLoading,
		userConvexId: userData?._id,
		isCandidate: userData?.role === "candidate",
		isInterviewer: userData?.role === "interviewer",
	};
};
