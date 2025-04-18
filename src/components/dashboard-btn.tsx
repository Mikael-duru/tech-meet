"use client";

import Link from "next/link";
import React from "react";
import { LayoutDashboard } from "lucide-react";

import { Button } from "./ui/button";
import { UseUserRole } from "@/hooks/use-user-role";

const DashboardBtn = () => {
	const { isCandidate, isLoading } = UseUserRole();

	if (isCandidate || isLoading) return null;

	return (
		<Link href="/dashboard">
			<Button>
				<LayoutDashboard size={16} />
				Dashboard
			</Button>
			{/* <Button
				className="hidden md:inline-flex items-center gap-2 font-medium"
			>
				<LayoutDashboard className="h-4 w-4" />
				Dashboard
			</Button>
			<Button className="md:hidden w-10 h-10 p-0" size="icon">
				<LayoutDashboard className="h-4 w-4" />
			</Button> */}
		</Link>
	);
};

export default DashboardBtn;
