"use client";

import { useQuery } from "convex/react";
import React, { useState } from "react";
import { BarLoader } from "react-spinners";

import { api } from "../../convex/_generated/api";
import ScheduleDialog from "./schedule-dialog";
import MeetingCard from "./meeting-card";
import { InterviewFormType } from "@/lib/types";

const ScheduleUI = () => {
	const [open, setOpen] = useState(false);

	const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
	const [initialFormData, setInitialFormData] =
		useState<InterviewFormType | null>(null);

	const sortedInterview = interviews.sort((a, b) => {
		return b.startTime - a.startTime;
	});

	return (
		<div className="container max-w-7xl mx-auto p-6 space-y-8">
			{/* Header */}
			<div className="flex flex-wrap gap-6 items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Interviews</h1>
					<p className="text-muted-foreground mt-1">
						Schedule and manage interviews
					</p>
				</div>

				{/* CTA */}
				<ScheduleDialog
					initialFormData={initialFormData}
					setInitialFormData={setInitialFormData}
					open={open}
					setOpen={setOpen}
				/>
			</div>

			{/* Content and loader */}
			{!sortedInterview ? (
				<BarLoader className="mt-4" width={"100%"} color="gray" />
			) : sortedInterview.length > 0 ? (
				<div className="spacey-4">
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{sortedInterview.map((interview) => (
							<MeetingCard
								key={interview._id}
								interview={interview}
								setInitialFormData={setInitialFormData}
								setOpen={setOpen}
							/>
						))}
					</div>
				</div>
			) : (
				<div className="text-center py-20 text-muted-foreground">
					No interviews scheduled
				</div>
			)}
		</div>
	);
};

export default ScheduleUI;
