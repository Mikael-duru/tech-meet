"use client";

import React from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const SwitchRole = ({
	userConvexId,
	isInterviewer,
}: {
	userConvexId: Id<"users">;
	isInterviewer: boolean;
}) => {
	const updateUserRole = useMutation(api.users.updateUserRole);
	const userRoleSwitch = isInterviewer ? "candidate" : "interviewer";

	const handleSwitchRole = async () => {
		// Logic to switch roles
		try {
			await updateUserRole({
				id: userConvexId,
				role: userRoleSwitch,
			});
		} catch (error) {
			console.error("Error switching role:", error);
			toast.error("Failed to switch role");
		}
	};

	if (!userConvexId) return null;

	return (
		<Button onClick={handleSwitchRole} role="switch">
			Switch to {userRoleSwitch}
		</Button>
	);
};

export default SwitchRole;
