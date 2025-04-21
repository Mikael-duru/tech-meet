import useMeetingActions from "@/hooks/use-meeting-actions";
import { Interview, InterviewFormType } from "@/lib/types";
import { getMeetingStatus } from "@/lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { api } from "../../convex/_generated/api";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

import { format } from "date-fns";
import React from "react";
import { CalendarIcon, EditIcon, TrashIcon } from "lucide-react";
import { useMutation, useQuery } from "convex/react";

type Props = {
	interview: Interview;
	setInitialFormData?: React.Dispatch<
		React.SetStateAction<InterviewFormType | null>
	>;
	setOpen?: (open: boolean) => void;
};

const MeetingCard = ({ interview, setInitialFormData, setOpen }: Props) => {
	const { joinMeeting } = useMeetingActions();

	const initialInterviewData = useQuery(
		api.interviews.getInterviewByStreamCallId,
		{
			streamCallId: interview.streamCallId,
		}
	);

	const deleteInterview = useMutation(api.interviews.deleteInterview);

	const getInitialFormData = () => {
		if (!initialInterviewData || !setInitialFormData || !setOpen) return;

		const { _id, title, description, startTime, candidateId, interviewerIds } =
			initialInterviewData;

		const formattedStartTime = format(new Date(startTime), "hh:mm");

		setInitialFormData({
			id: _id,
			title,
			description: description || "",
			date: new Date(startTime),
			time: formattedStartTime,
			candidateId,
			interviewerIds,
		});
		setOpen(true);
	};

	const handleInterviewDelete = () => {
		deleteInterview({ id: interview._id });
	};

	const status = getMeetingStatus(interview);

	let showStatus = "";
	switch (status) {
		case "upcoming":
			showStatus = "Upcoming";
			break;
		case "live":
			showStatus = "Live Now";
			break;
		case "missed":
			showStatus = "Ended";
			break;
		default:
			showStatus = "Completed";
			break;
	}

	const formattedDate = format(
		new Date(interview.startTime),
		"EEEE, MMMM d · h:mm a"
	);

	return (
		<Card className="hover:bg-secondary/80 hover:border-primary/80 transition-colors duration-300 ease-in-out">
			<CardHeader className="space-y-2">
				<CardTitle className="capitalize flex items-center justify-between gap-4">
					{interview.title}
					{status === "upcoming" && (
						<Button
							variant={"destructive"}
							size={"sm"}
							onClick={handleInterviewDelete}
						>
							<TrashIcon />
						</Button>
					)}
				</CardTitle>

				<div className="flex items-center justify-between flex-wrap gap-2 py-1">
					<p className="flex items-center gap-2 text-sm text-muted-foreground">
						<CalendarIcon className="h-4 w-4" />
						{formattedDate}
					</p>

					<Badge
						variant={
							status === "live"
								? "default"
								: status === "upcoming"
									? "secondary"
									: "outline"
						}
					>
						{status && showStatus}
					</Badge>
				</div>

				{interview.description && (
					<CardDescription className="line-clamp-2">
						{interview.description}
					</CardDescription>
				)}
			</CardHeader>

			<CardContent>
				{status === "live" && (
					<Button
						className="w-full"
						onClick={() => joinMeeting(interview.streamCallId)}
					>
						Join Meeting
					</Button>
				)}

				{status === "upcoming" && (
					<div className="flex gap-3 items-center">
						<Button variant="outline" className="w-full" disabled>
							Waiting to Start
						</Button>
						<Button size="sm" onClick={getInitialFormData}>
							<EditIcon />
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default MeetingCard;
