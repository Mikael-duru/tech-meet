"use client";

import { useMutation, useQuery } from "convex/react";
import React from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
	CalendarIcon,
	CheckCircle2Icon,
	ClockIcon,
	XCircleIcon,
} from "lucide-react";
import { format } from "date-fns";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import LoaderUI from "@/components/loader-ui";
import { groupInterviews } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Interview } from "@/lib/types";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import CommentDialog from "@/components/comment-dialog";
import { DataTable } from "../(components)/data-table";
import { columns } from "../(components)/columns";
import UserInfo from "@/components/user-info";

const DashboardPage = () => {
	const users = useQuery(api.users.getUsers);
	const interviews = useQuery(api.interviews.getAllInterviews);
	const updateStatus = useMutation(api.interviews.updateInterviewStatus);
	const [isActiveCard, setIsActiveCard] = React.useState("");

	const handleStatusUpdate = async (
		interviewId: Id<"interviews">,
		status: string
	) => {
		try {
			//
			await updateStatus({ id: interviewId, status });
			toast.success(`Interview marked as "${status}"`, {
				id: "marking-interview",
			});
		} catch (error) {
			console.error("Error marking interview status:", error);
			toast.error(`Failed to mark interview as "${status}"`, {
				id: "marking-interview",
			});
		}
	};

	if (!interviews || !users) return <LoaderUI />;

	const { completed, outcome } = groupInterviews(interviews);

	const sortedOutcome = outcome?.sort((a: any, b: any) => {
		const dateA = new Date(a.startTime).getTime();
		const dateB = new Date(b.startTime).getTime();
		return dateA - dateB;
	});

	return (
		<div className="container mx-auto py-10">
			{/* Header */}
			<section className="rounded-lg bg-card p-6 border shadow-sm mb-8">
				<div className="flex items-center justify-between flex-wrap gap-5">
					<div>
						<h1 className="text-3xl font-bold">Dashboard</h1>
						<p className="text-muted-foreground mt-1">
							Review & Finalize Interview Outcomes
						</p>
					</div>
					<Link href="/schedule">
						<Button>Schedule New Interview</Button>
					</Link>
				</div>
			</section>

			{/* Main */}
			<div className="space-y-8">
				{completed?.length > 0 && (
					<section>
						{/* Title */}
						<div className="flex items-center gap-2 mb-4">
							<h2 className="text-xl font-semibold">Completed</h2>
							<Badge variant="secondary">{completed.length}</Badge>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{completed.map((interview: Interview) => {
								const startTime = new Date(interview.startTime);

								return (
									<Card
										className={`"hover:shadow-md hover:border-primary/80 hover:bg-secondary/80 transition-all" ${isActiveCard === interview._id ? "border-primary/80" : ""}`}
										key={interview._id}
									>
										{/* Candidate Info */}
										<CardHeader className="pt-4 px-4 pb-0">
											<UserInfo userId={interview.candidateId} />

											<h3 className="text-sm text-muted-foreground pt-2 capitalize">
												<span className="text-gray-300">title:</span>{" "}
												{interview.title}
											</h3>
										</CardHeader>

										{/* Date & Time */}
										<CardContent className="p-4">
											<div className="flex items-center gap-4 text-sm text-muted-foreground">
												<div className="flex items-center gap-1">
													<CalendarIcon className="h-4 w-4" />
													{format(startTime, "MMM dd")}
												</div>
												<div className="flex items-center gap-1">
													<ClockIcon className="h-4 w-4" />
													{format(startTime, "hh:mm a")}
												</div>
											</div>
										</CardContent>

										{/* Pass & Fail buttons */}
										<CardFooter className="p-4 pt-0 flex flex-col gap-3">
											<div className="flex gap-2 w-full">
												<Button
													className="flex-1"
													onClick={() =>
														handleStatusUpdate(interview._id, "passed")
													}
												>
													<CheckCircle2Icon className="h-4 w-4 mr-2" />
													Pass
												</Button>
												<Button
													variant="destructive"
													className="flex-1"
													onClick={() =>
														handleStatusUpdate(interview._id, "failed")
													}
												>
													<XCircleIcon className="h-4 w-4 mr-2" />
													Fail
												</Button>
											</div>
											<CommentDialog
												interviewId={interview._id}
												onOpenChange={(isOpen) => {
													if (isOpen) {
														setIsActiveCard(interview._id);
													} else {
														setIsActiveCard("");
													}
												}}
											/>
										</CardFooter>
									</Card>
								);
							})}
						</div>
					</section>
				)}

				{sortedOutcome?.length > 0 && (
					<section className="pt-5">
						<div className="flex items-center gap-2 mb-4">
							<h2 className="text-xl font-semibold">Interviews Outcome</h2>
							<Badge variant="secondary">{sortedOutcome?.length}</Badge>
						</div>

						<DataTable columns={columns} data={sortedOutcome} />
					</section>
				)}
			</div>
		</div>
	);
};

export default DashboardPage;
