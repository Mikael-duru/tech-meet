"use client";

import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
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
	const [isRejoining, setIsRejoining] = useState(false);

	// Rejoin call on reload/refresh in a tab
	useEffect(() => {
		if (!call || !id) return;

		const session = sessionStorage.getItem("__callInSession");
		if (!session) return;

		try {
			const { callSession, setupCompleted } = JSON.parse(session);
			if (callSession !== id || !setupCompleted) return;

			const rejoinCall = async () => {
				toast.loading("Rejoining call...", { id: "rejoining" });
				setIsRejoining(true);

				try {
					call.camera.disable();
					await call.join();
					setIsSetupComplete(true);
					toast.dismiss("rejoining");
				} catch (err) {
					console.error("Call rejoin failed:", err);
					toast.error("Failed to rejoin call", { id: "rejoining" });
					setIsSetupComplete(false);
				} finally {
					setIsRejoining(false);
				}
			};

			rejoinCall();
		} catch (err) {
			console.warn("Invalid session data:", err);
			sessionStorage.removeItem("__callInSession");
			if (localStorage.getItem("__techMeetCallSession") === id) {
				localStorage.removeItem("__techMeetCallSession");
			}
		}
	}, [call, id]);

	// Store in sessionStorage when setup is complete
	useEffect(() => {
		if (isSetupComplete && id) {
			sessionStorage.setItem(
				"__callInSession",
				JSON.stringify({
					callSession: id,
					setupCompleted: true,
				})
			);
			localStorage.setItem("__techMeetCallSession", id as string);
		}
	}, [isSetupComplete, id]);

	// Add window beforeunload event to clean up localStorage properly.
	useEffect(() => {
		const handleTabClose = () => {
			// Only clear if this tab is the only one holding the session
			const callSessionId = localStorage.getItem("__techMeetCallSession");
			if (callSessionId === id) {
				localStorage.removeItem("__techMeetCallSession");
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
				<Button
					className="gap-2 font-medium bg-emerald-600 dark:bg-emerald-800 dark:border-emerald-400 text-emerald-50 hover:bg-emerald-700 hover:text-emerald-50"
					onClick={() => router.push("/")}
				>
					Return to Home
				</Button>
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
						isRejoining={isRejoining}
					/>
				) : (
					<MeetingRoom />
				)}
			</StreamTheme>
		</StreamCall>
	);
};

export default MeetingPage;
