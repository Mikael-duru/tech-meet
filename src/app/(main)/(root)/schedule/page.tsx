"use client";

import React from "react";
import { redirect } from "next/navigation";

import { UseUserRole } from "@/hooks/use-user-role";
import LoaderUI from "@/components/loader-ui";
import ScheduleUI from "@/components/schedule-ui";

const SchedulePage = () => {
	const { isInterviewer, isLoading } = UseUserRole();

	if (isLoading) return <LoaderUI />;

	if (!isInterviewer) redirect("/");

	return <ScheduleUI />;
};

export default SchedulePage;
