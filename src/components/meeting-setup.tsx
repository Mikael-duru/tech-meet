import {
	DeviceSettings,
	useCall,
	VideoPreview,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { CameraIcon, MicIcon, SettingsIcon } from "lucide-react";
import { toast } from "sonner";

import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type MeetingSetupProps = {
	onSetupComplete: () => void;
	id: string | string[];
	isRejoining: boolean;
};

const MeetingSetup = ({
	onSetupComplete,
	id,
	isRejoining,
}: MeetingSetupProps) => {
	const [isCameraDisabled, setIsCameraDisabled] = useState(true);
	const [isMicDisabled, setIsMicDisabled] = useState(false);
	const [activeCallTab, setActiveCallTab] = useState("");
	const [isJoining, setIsJoining] = useState(false);

	const router = useRouter();

	const call = useCall(); // useCall() provides the call prop passed to StreamCall

	useEffect(() => {
		if (isCameraDisabled) call?.camera.disable();
		else call?.camera.enable();
	}, [isCameraDisabled, call?.camera]);

	useEffect(() => {
		if (isMicDisabled) call?.microphone.disable();
		else call?.microphone.enable();
	}, [isMicDisabled, call?.microphone]);

	useEffect(() => {
		const activeCallTab = localStorage.getItem("__techMeetCallSession");
		if (!activeCallTab) return;

		setActiveCallTab(activeCallTab);
	}, [id, router]);

	const handleJoinMeeting = async () => {
		setIsJoining(true);
		if (activeCallTab) {
			// If user is already in any meeting (same or different)
			if (activeCallTab === id) {
				toast.error(
					"You're already in this meeting in another tab. Please switch to that tab.",
					{
						id: "joining-meeting",
					}
				);
			} else {
				toast.error(
					"You're currently in a different meeting. Please end that call first.",
					{
						id: "joining-meeting",
					}
				);
			}
			return;
		}
		await call?.join();
		toast.success("Joined meeting successfully! 🎉", {
			id: "joining-meeting",
		});
		onSetupComplete();
	};

	return (
		<div className="min-h-[calc(100vh-4rem-1px)] flex items-center justify-center py-6 bg-background/95">
			<div className="w-full max-w-[1200px] mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* video preview container */}
					<Card className="md:col-span-1 p-6 flex flex-col">
						<div>
							<h1 className="text-xl font-semibold mb-1">Camera Preview</h1>
							<p className="text-sm text-muted-foreground">
								Take a moment to relax before joining.
							</p>
						</div>

						{/* video preview */}
						<div className="mt-4 flex-1 min-h-[400px] rounded-xl overflow-hidden bg-muted/50 border relative">
							<div className="absolute inset-0">
								<VideoPreview className="h-full w-full" />
							</div>
						</div>
					</Card>

					{/* Controls */}
					<Card className="md:col-span-1 p-6">
						<div className="h-full flex flex-col">
							{/* Meeting details  */}
							<div>
								<h2 className="text-xl font-semibold mb-1">Meeting Details</h2>
								<p className="text-sm text-muted-foreground break-all">
									{call?.id}
								</p>
							</div>

							<div className="flex-1 flex flex-col justify-between">
								<div className="space-y-6 mt-8">
									{/* Camera toggle */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
												<CameraIcon className="h-5 w-5 text-primary" />
											</div>
											<div>
												<p className="font-medium">Camera</p>
												<p className="text-sm text-muted-foreground">
													{isCameraDisabled ? "Off" : "On"}
												</p>
											</div>
										</div>
										<Switch
											checked={!isCameraDisabled}
											disabled={isRejoining || isJoining}
											onCheckedChange={(checked) =>
												setIsCameraDisabled(!checked)
											}
										/>
									</div>

									{/* Mic toggle */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
												<MicIcon className="h-5 w-5 text-primary" />
											</div>
											<div>
												<p className="font-medium">Microphone</p>
												<p className="text-sm text-muted-foreground">
													{isMicDisabled ? "Off" : "On"}
												</p>
											</div>
										</div>
										<Switch
											checked={!isMicDisabled}
											disabled={isRejoining || isJoining}
											onCheckedChange={(checked) => setIsMicDisabled(!checked)}
										/>
									</div>

									{/* Additional settings */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
												<SettingsIcon className="h-5 w-5 text-primary" />
											</div>
											<div>
												<p className="font-medium">Settings</p>
												<p className="text-sm text-muted-foreground">
													Configure devices
												</p>
											</div>
										</div>
										<DeviceSettings />
									</div>
								</div>

								{/* Join button */}
								<div className="space-y-3 mt-8">
									<Button
										className="w-full"
										size="lg"
										onClick={() => {
											toast.loading("Waiting for permission...", {
												id: "joining-meeting",
											});

											handleJoinMeeting();
										}}
										disabled={isRejoining || isJoining}
									>
										Proceed to Meeting
									</Button>
									<p className="text-xs text-center text-muted-foreground">
										Do not worry, our team is super friendly! We want you to
										succeed. 🎉
									</p>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default MeetingSetup;
