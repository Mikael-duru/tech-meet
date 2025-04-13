import React, { useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useMeetingActions from "@/hooks/use-meeting-actions";
import { toast } from "sonner";

type MeetingModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	isJoinMeeting: boolean;
};

const MeetingModal = ({
	isOpen,
	onClose,
	title,
	isJoinMeeting,
}: MeetingModalProps) => {
	const [meetingUrl, setMeetingUrl] = useState("");
	const { createInstantMeeting, joinMeeting } = useMeetingActions();
	const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

	const handleMeeting = () => {
		if (isJoinMeeting) {
			let meetingId = "";

			try {
				const url = new URL(meetingUrl.trim());

				const appUrl = new URL(APP_URL ?? "");
				const isSameOrigin = url.origin === appUrl.origin;
				const isMeetingPath = url.pathname.startsWith("/meeting/");

				if (isSameOrigin && isMeetingPath) {
					meetingId = url.pathname.split("/").pop() || "";
				} else {
					toast.error(
						"Invalid meeting link. Please use a valid TechMeet link.",
						{
							id: "join-meeting",
						}
					);
					return;
				}
			} catch {
				// Assume meetingUrl as meeting ID
				meetingId = meetingUrl.trim();
			}

			if (meetingId) joinMeeting(meetingId);
		} else {
			createInstantMeeting();
		}

		setMeetingUrl("");
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<DialogDescription />

				<div className="space-y-4">
					{isJoinMeeting && (
						<Input
							placeholder="Paste meeting link or ID here..."
							value={meetingUrl}
							onChange={(e) => setMeetingUrl(e.target.value)}
						/>
					)}

					<div className="flex justify-end gap-3">
						<Button
							variant="outline"
							onClick={() => {
								onClose();
								setMeetingUrl("");
							}}
						>
							Cancel
						</Button>
						<Button
							onClick={() => {
								if (isJoinMeeting) {
									toast.loading("Checking meeting link/ID...", {
										id: "join-meeting",
									});
								} else {
									toast.loading("Starting Meeting...", {
										id: "create-meeting",
									});
								}
								handleMeeting();
							}}
							disabled={isJoinMeeting && !meetingUrl.trim()}
						>
							{isJoinMeeting ? "Join Meeting" : "Start Meeting"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default MeetingModal;
