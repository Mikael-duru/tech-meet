"use client";

import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { VideoOffIcon } from "lucide-react";

import LoaderUI from "@/components/loader-ui";
import MeetingSetup from "@/components/meeting-setup";
import MeetingRoom from "@/components/meeting-room";
import useGetCallById from "@/hooks/use-get-call-by-id";
import { Button } from "@/components/ui/button";

const MeetingPage = () => {
	const { id } = useParams();
	const router = useRouter();

	const { isLoaded } = useUser();
	const { call, isCallLoading } = useGetCallById(id);
	const [isSetupComplete, setIsSetupComplete] = useState(false);

	// If already on-call, Switch to meeting room on refresh
	useEffect(() => {
		const { sessionStreamCallId } = JSON.parse(
			sessionStorage.getItem("__meet_callInSession") || "{}"
		);

		if (sessionStreamCallId && sessionStreamCallId === id)
			setIsSetupComplete(true);
	}, [id]);

	useEffect(() => {
		return () => {
			sessionStorage.removeItem("__meet_callInSession");
			localStorage.removeItem("__meet_tabSession");
		};
	}, [router]);

	// Add window beforeunload event to clean up localStorage properly.
	useEffect(() => {
		const handleTabClose = () => {
			// Only clear if this tab is the only one holding the session
			const callSessionId = localStorage.getItem("__meet_tabSession");
			if (callSessionId === id) {
				localStorage.removeItem("__meet_tabSession");
			}
		};

		window.addEventListener("beforeunload", handleTabClose);
		return () => {
			window.removeEventListener("beforeunload", handleTabClose);
		};
	}, [id]);

	if (!isLoaded || isCallLoading) return <LoaderUI />;

	if (!call) {
		return (
			<div className="h-[calc(100vh-4rem-1px)] flex items-center justify-center">
				<p className="text-2xl font-semibold text-muted-foreground">
					Meeting not found
				</p>
			</div>
		);
	}

	if (call.state.endedAt) {
		return (
			<div className="h-[calc(100vh-4rem-1px)] w-full flex flex-col items-center justify-center text-center p-6">
				<VideoOffIcon className="stroke stroke-[1.5] stroke-red-500 mb-4 size-12 md:size-16" />
				<h1 className="text-2xl font-bold mb-2">The meeting has ended</h1>
				<p className="text-muted-foreground mb-6">
					The host has ended this call for everyone.
				</p>
				<Button onClick={() => router.push("/")}>Return to Home</Button>
			</div>
		);
	}

	return (
		<StreamCall call={call}>
			<StreamTheme>
				{!isSetupComplete ? (
					<MeetingSetup
						onSetupComplete={() => setIsSetupComplete(true)}
						id={id}
					/>
				) : (
					<MeetingRoom />
				)}
			</StreamTheme>
		</StreamCall>
	);
};

export default MeetingPage;
