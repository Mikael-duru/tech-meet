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
			<Button className="gap-2 font-medium bg-emerald-600 dark:bg-emerald-800 dark:border-emerald-400 text-emerald-50 hover:bg-emerald-700 hover:text-emerald-50">
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
