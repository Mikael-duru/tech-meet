"use client";

import React from "react";
import { PhoneCall } from "lucide-react";

import { Button } from "./ui/button";
import useMeetingActions from "@/hooks/use-meeting-actions";

const ReturnToCallBtn = () => {
	const { joinMeeting } = useMeetingActions();

	const storedSettings = JSON.parse(
		sessionStorage.getItem("__meet_settingsSession") || "{}"
	);

	if (!storedSettings || !storedSettings.id) return null;

	return (
		<Button
			className="animate-bounce"
			size={"lg"}
			onClick={() => joinMeeting(storedSettings.id)}
		>
			<PhoneCall className="mr-1" /> Return to Call
		</Button>
	);
};

export default ReturnToCallBtn;
