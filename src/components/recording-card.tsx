import { CallRecording } from "@stream-io/video-react-sdk";
import React from "react";
import { format } from "date-fns";
import { calculateRecordingDuration } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { CalendarIcon, ClockIcon, PlayIcon } from "lucide-react";
import { Button } from "./ui/button";
import CopyLinkBtn from "./copy-link-btn";

const RecordingCard = ({ recording }: { recording: CallRecording }) => {
	const formattedStartTime = recording.start_time
		? format(new Date(recording.start_time), "MMM d, yyyy, hh:mm a")
		: "Unknown";

	const duration =
		recording.start_time && recording.end_time
			? calculateRecordingDuration(recording.start_time, recording.end_time)
			: "Unknown duration";

	return (
		<Card className="group hover:shadow-md transition-all">
			{/* Header */}
			<CardHeader>
				<div>
					<div className="flex flex-col gap-1.5">
						<div className="flex items-center text-sm text-muted-foreground gap-2">
							<CalendarIcon className="h-3.5 w-3.5" />
							<span>{formattedStartTime}</span>
						</div>
						<div className="flex items-center text-sm text-muted-foreground gap-2">
							<ClockIcon className="h-3.5 w-3.5" />
							<span>{duration}</span>
						</div>
					</div>

					{/* <Button variant={"destructive"}>
					<TrashIcon />
				</Button> */}
				</div>
			</CardHeader>

			{/* Content */}
			<CardContent>
				<div className="w-full aspect-video bg-muted/50 rounded-lg flex items-center justify-center group">
					<div className="size-12 rounded-full bg-background/90 flex items-center justify-center group-hover:bg-primary transition-colors">
						<PlayIcon className="size-6 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
					</div>
				</div>
			</CardContent>
			<CardFooter className="gap-2">
				<Button
					className="flex-1"
					onClick={() => window.open(recording.url, "_blank")}
				>
					<PlayIcon className="size-4 mr-2" />
					Play Recording
				</Button>
				<CopyLinkBtn url={recording.url} type="Recording" />
			</CardFooter>
		</Card>
	);
};

export default RecordingCard;
