import React from "react";
import { UserCircleIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/lib/types";

const UserInfo = ({ user }: { user: User }) => {
	return (
		<div className="flex items-center gap-2">
			<Avatar className="size-6">
				<AvatarImage src={user.image} />
				<AvatarFallback>
					<UserCircleIcon className="size-4" />
				</AvatarFallback>
			</Avatar>
			<span>{user.name}</span>
		</div>
	);
};

export default UserInfo;
