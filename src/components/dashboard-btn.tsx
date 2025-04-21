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
			<Button className="max-sm:hidden font-medium">
				<LayoutDashboard size={16} />
				<span className="max-sm:hidden">Dashboard</span>
			</Button>
			<Button className="sm:hidden" size="icon">
				<LayoutDashboard size={16} />
			</Button>
		</Link>
	);
};

export default DashboardBtn;
