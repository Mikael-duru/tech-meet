import React from "react";
import { UserCircleIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/lib/types";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const UserInfo = ({ userId }: { userId: string }) => {
	const users = useQuery(api.users.getUsers) as User[];

	const candidate = users?.find((user) => user.clerkId === userId);

	const name = candidate?.name || "Anonymous Candidate";

	const candidateInitials =
		candidate?.name
			?.split(" ")
			.map((n) => n[0])
			.join("") || "AC";

	return (
		<div className="flex items-center gap-2">
			<Avatar className="size-6">
				<AvatarImage src={candidate?.image} />
				<AvatarFallback>{candidateInitials}</AvatarFallback>
			</Avatar>
			<span>{name}</span>
		</div>
	);
};

export default UserInfo;
