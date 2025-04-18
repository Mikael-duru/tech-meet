"use client";

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarClockIcon, XIcon } from "lucide-react";

import { api } from "../../convex/_generated/api";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { TIME_SLOTS } from "@/constants";
import UserInfo from "./user-info";
import { Calendar } from "./ui/calendar";
import { InterviewFormType } from "@/lib/types";

type Props = {
	open: boolean;
	setOpen: (open: boolean) => void;
	initialFormData: InterviewFormType | null;
	setInitialFormData: React.Dispatch<
		React.SetStateAction<InterviewFormType | null>
	>;
};

const ScheduleDialog = ({
	open,
	setOpen,
	initialFormData,
	setInitialFormData,
}: Props) => {
	const client = useStreamVideoClient();
	const { user } = useUser();
	const [isCreating, setIsCreating] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [titleErr, setTitleErr] = useState(false);
	const [candidateIdErr, setCandidateIdErr] = useState(false);

	// Form data initialization with existing data for editing
	useEffect(() => {
		if (initialFormData) {
			setFormData({
				title: initialFormData.title,
				description: initialFormData.description,
				date: new Date(initialFormData.date),
				time: initialFormData.time,
				candidateId: initialFormData.candidateId,
				interviewerIds: initialFormData.interviewerIds,
			});
		}
	}, [initialFormData, user?.id]);

	// Default form data handling
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		date: new Date(),
		time: "09:00",
		candidateId: "",
		interviewerIds: user?.id ? [user.id] : [],
	});

	// Errors handling in real-time
	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitleErr(false);
		setFormData({ ...formData, title: e.target.value });
	};

	const handleCandidateIdChange = (candidateId: string) => {
		setCandidateIdErr(false);
		setFormData({ ...formData, candidateId });
	};

	const users = useQuery(api.users.getUsers) ?? [];
	const createInterview = useMutation(api.interviews.createInterview);
	const updateInterview = useMutation(api.interviews.updateInterview);

	const candidates = users.filter((user) => user.role === "candidate");
	const interviewers = users.filter((user) => user.role === "interviewer");

	const handleScheduleMeeting = async () => {
		if (!client || !user) return;

		// Validate form data
		const isTitleEmpty = formData.title === "";
		const isCandidateIdEmpty = formData.candidateId === "";

		// Error handling
		setTitleErr(isTitleEmpty);
		setCandidateIdErr(isCandidateIdEmpty);

		if (isTitleEmpty || isCandidateIdEmpty) {
			toast.error("Please fill in the required fields.", {
				id: "schedule-meeting",
			});
			return;
		}

		// Get form data
		const { title, description, date, time, candidateId, interviewerIds } =
			formData;

		// Convert time to milliseconds and set to meeting date
		const [hours, minutes] = time.split(":");
		const meetingDate = new Date(date);
		meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

		if (!initialFormData) {
			// Create new interview
			setIsCreating(true);

			try {
				// Create meeting call
				const id = crypto.randomUUID();
				const call = client.call("default", id);

				await call.getOrCreate({
					data: {
						starts_at: meetingDate.toISOString(),
						custom: {
							description: title,
							additionalDetails: description,
						},
					},
				});

				// Create interview
				await createInterview({
					title,
					description,
					startTime: meetingDate.getTime(),
					status: "upcoming",
					streamCallId: id,
					candidateId,
					interviewerIds,
				});

				toast.success("Interview created successfully! 🎉", {
					id: "schedule-meeting",
				});
			} catch (error) {
				console.error(error);
				toast.error("Failed to schedule interview. Please try again.", {
					id: "schedule-meeting",
				});
			} finally {
				setIsCreating(false);
			}
		} else {
			// Update existing interview
			setIsUpdating(true);

			try {
				await updateInterview({
					id: initialFormData.id,
					title,
					description,
					startTime: meetingDate.getTime(),
					candidateId,
					interviewerIds,
				});

				toast.success("Interview updated successfully! 🎉", {
					id: "update-meeting",
				});

				setInitialFormData(null);
			} catch (error) {
				console.error(error);
				toast.error("Failed to update interview. Please try again.", {
					id: "update-meeting",
				});
			} finally {
				setIsUpdating(false);
			}
		}

		// Close dialog and reset form
		setOpen(false);
		resetForm();
	};

	const resetForm = () => {
		setFormData({
			title: "",
			description: "",
			date: new Date(),
			time: "09:00",
			candidateId: "",
			interviewerIds: user?.id ? [user.id] : [],
		});
	};

	const addInterviewer = (interviewerId: string) => {
		if (!formData.interviewerIds.includes(interviewerId)) {
			setFormData((prev) => ({
				...prev,
				interviewerIds: [...prev.interviewerIds, interviewerId],
			}));
		}
	};

	const removeInterviewer = (interviewerId: string) => {
		if (interviewerId === user?.id) return;
		setFormData((prev) => ({
			...prev,
			interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
		}));
	};

	const selectedInterviewers = interviewers.filter((i) =>
		formData.interviewerIds.includes(i.clerkId)
	);

	const availableInterviewers = interviewers.filter(
		(i) => !formData.interviewerIds.includes(i.clerkId)
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<CalendarClockIcon /> Schedule Interview
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[500px] max-h-[calc(100vh-100px)] overflow-auto">
				<DialogHeader>
					<DialogTitle>
						{!initialFormData ? "Schedule new" : "Update"} interview
					</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<div className="space-y-5 py-2">
						{/* Title */}
						<div className="space-y-2">
							<label
								className={`text-sm font-medium ${titleErr ? "text-red-500" : ""}`}
							>
								Title
							</label>
							<Input
								placeholder="Interview title"
								value={formData.title}
								onChange={(e) => handleTitleChange(e)}
								className={titleErr ? "border-red-500" : ""}
							/>
							{titleErr && (
								<p className="text-red-500 text-sm">Title is required</p>
							)}
						</div>

						{/* Description */}
						<div className="space-y-2">
							<label className="text-sm font-medium">Description</label>
							<Textarea
								placeholder="Interview description"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								rows={3}
							/>
						</div>

						{/* Candidate */}
						<div className="space-y-2">
							<label
								className={`text-sm font-medium ${candidateIdErr ? "text-red-500" : ""}`}
							>
								Candidate
							</label>
							<Select
								value={formData.candidateId}
								onValueChange={(candidateId) =>
									handleCandidateIdChange(candidateId)
								}
							>
								<SelectTrigger
									className={candidateIdErr ? "border-red-500" : ""}
								>
									<SelectValue placeholder="Select candidate" />
								</SelectTrigger>
								<SelectContent>
									{candidates.map((candidate) => (
										<SelectItem
											key={candidate.clerkId}
											value={candidate.clerkId}
										>
											<UserInfo user={candidate} />
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{candidateIdErr && (
								<p className="text-red-500 text-sm">Candidate is required</p>
							)}
						</div>

						{/* Interviewers */}
						<div className="space-y-2">
							<label className="text-sm font-medium">Interviewers</label>
							<div className="flex flex-wrap gap-2 mb-2">
								{selectedInterviewers.map((interviewer) => (
									<div
										key={interviewer.clerkId}
										className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
									>
										<UserInfo user={interviewer} />
										{interviewer.clerkId !== user?.id && (
											<Button
												onClick={() => removeInterviewer(interviewer.clerkId)}
												className="hover:text-destructive transition-colors"
												size={"icon"}
												variant={"ghost"}
											>
												<XIcon className="size-4" />
											</Button>
										)}
									</div>
								))}
							</div>
							{availableInterviewers.length > 0 && (
								<Select onValueChange={addInterviewer}>
									<SelectTrigger>
										<SelectValue placeholder="Add interviewer" />
									</SelectTrigger>
									<SelectContent>
										{availableInterviewers.map((interviewer) => (
											<SelectItem
												key={interviewer.clerkId}
												value={interviewer.clerkId}
											>
												<UserInfo user={interviewer} />
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						</div>

						{/* Date & Time */}
						<div className="flex flex-wrap gap-5">
							{/* Calendar */}
							<div className="space-y-2">
								<label className="text-sm font-medium">Date</label>
								<Calendar
									mode="single"
									selected={formData.date}
									onSelect={(date) =>
										date && setFormData({ ...formData, date })
									}
									disabled={(date) => date < new Date()}
									className="rounded-md border"
								/>
							</div>

							{/* Time */}
							<div className="space-y-2 flex-1">
								<label className="text-sm font-medium">Time</label>
								<Select
									value={formData.time}
									onValueChange={(time) => setFormData({ ...formData, time })}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select time" />
									</SelectTrigger>
									<SelectContent>
										{TIME_SLOTS.map((time) => (
											<SelectItem key={time} value={time}>
												{time}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* CTA btns */}
						<div className="flex justify-end gap-3 pt-4">
							<Button
								variant="outline"
								onClick={() => {
									setOpen(false);
									setInitialFormData(null);
									resetForm();
									setTitleErr(false);
									setCandidateIdErr(false);
								}}
							>
								Cancel
							</Button>
							<Button
								onClick={() => {
									if (!initialFormData) {
										toast.loading("Creating interview...", {
											id: "schedule-meeting",
										});
									} else {
										toast.loading("Updating interview...", {
											id: "update-meeting",
										});
									}

									handleScheduleMeeting();
								}}
								disabled={isCreating || isUpdating}
							>
								{!initialFormData ? "Create Interview" : "Update Interview"}
							</Button>
						</div>
					</div>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
};

export default ScheduleDialog;
