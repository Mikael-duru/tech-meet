"use client";

import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

import LoaderUI from "@/components/loader-ui";
import MeetingSetup from "@/components/meeting-setup";
import MeetingRoom from "@/components/meeting-room";
import useGetCallById from "@/hooks/use-get-call-by-id";

const MeetingPage = () => {
	const { id } = useParams();
	const { isLoaded } = useUser();
	const { call, isCallLoading } = useGetCallById(id);
	const [isSetupComplete, setIsSetupComplete] = useState(false);

	// Check if setup is complete and
	useEffect(() => {
		// On mount: check if cookie exists
		const inSession = Cookies.get("callInSession") === "true";
		if (inSession) {
			setIsSetupComplete(inSession);
		}

		return () => {
			// On unmount: remove cookie
			Cookies.remove("callInSession");
		};
	}, []);

	// Store setup complete status in cookie if true
	useEffect(() => {
		if (isSetupComplete) {
			Cookies.set("callInSession", "true");
		}
	}, [isSetupComplete]);

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

	return (
		<StreamCall call={call}>
			<StreamTheme>
				{!isSetupComplete ? (
					<MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />
				) : (
					<MeetingRoom />
				)}
			</StreamTheme>
		</StreamCall>
	);
};

export default MeetingPage;
