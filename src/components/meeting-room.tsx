import {
	CallControls,
	CallingState,
	CallParticipantsList,
	PaginatedGridLayout,
	SpeakerLayout,
	useCall,
	useCallStateHooks,
} from "@stream-io/video-react-sdk";
import {
	LayoutListIcon,
	LoaderCircleIcon,
	UsersIcon,
	VideoIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "./ui/resizable";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import EndCallButton from "./end-call-button";
import CodeEditor from "./code-editor";
import CopyLinkBtn from "./copy-link-btn";
import { Card, CardContent } from "./ui/card";
import { PulseLoader } from "react-spinners";

const MeetingRoom = () => {
	const { id } = useParams();
	const router = useRouter();
	const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
	const [showParticipants, setShowParticipants] = useState(false);
	const { useCallCallingState } = useCallStateHooks();

	const call = useCall();

	useEffect(() => {
		if (!call || !id) return; // Don't do anything until everything is ready

		const { sessionStreamCallId } = JSON.parse(
			sessionStorage.getItem("__meet_callInSession") || "{}"
		);

		// Case 1: No session — safe to store a new one
		if (!sessionStreamCallId) {
			sessionStorage.setItem(
				"__meet_callInSession",
				JSON.stringify({
					sessionStreamCallId: id,
				})
			);
			localStorage.setItem("__meet_tabSession", id as string);
			return; // Don't continue
		}

		// Case 2: Session mismatch — do nothing
		if (sessionStreamCallId !== id) return;

		// Case 3: Session matches — try to reconnect
		const reconnectCall = async () => {
			const storedSettings = JSON.parse(
				sessionStorage.getItem("__meet_settingsSession") || "{}"
			);

			const { sessionIsMicDisabled, sessionIsCameraDisabled } = storedSettings;

			try {
				if (sessionIsMicDisabled) call.microphone.disable();
				if (sessionIsCameraDisabled) call.camera.disable();
				if (callingState === CallingState.IDLE) await call.join();
			} catch (err) {
				console.warn("Invalid session data:", err);
			}
		};

		reconnectCall();
	}, [call, id]);

	const callingState = useCallCallingState();

	if (callingState === CallingState.LEFT) {
		return (
			<div className="h-[calc(100vh-4rem-1px)] flex flex-col items-center justify-center gap-2 text-center">
				<Card>
					<CardContent className="space-y-4 py-6">
						<span className="text-3xl">👋</span>
						<h2 className="text-2xl font-semibold">
							You&apos;ve left the call
						</h2>
						<p className="text-muted-foreground">Have a nice day ☀️</p>
						<p className="text-muted-foreground text-xs flex items-center justify-center gap-1">
							Redirecting to home...{" "}
							<LoaderCircleIcon className="animate-spin size-4" />
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (callingState !== CallingState.JOINED) {
		return (
			<div className="h-[calc(100vh-4rem-1px)] flex items-center justify-center">
				<VideoIcon className="size-20" />
				<PulseLoader color="gray" />
			</div>
		);
	}

	return (
		<div className="h-[calc(100vh-4rem-1px)]">
			<ResizablePanelGroup direction="horizontal" className="!px-0">
				<ResizablePanel
					defaultSize={35}
					maxSize={100}
					// minSize={25}
					className="relative"
				>
					{/* video layout */}
					<div className="absolute inset-0">
						{layout === "grid" ? (
							<PaginatedGridLayout />
						) : (
							<SpeakerLayout participantsBarPosition={"bottom"} />
						)}

						{/* Participants lists overlay */}
						{showParticipants && (
							<div className="absolute right-0 top-0 h-full w-[300px] p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
								<CallParticipantsList
									onClose={() => setShowParticipants(false)}
								/>
							</div>
						)}
					</div>

					{/* meeting controls */}
					<div className="absolute bottom-4 inset-x-0">
						<div className="flex gap-2 items-center justify-center flex-wrap">
							<div className="min-w-[300px]">
								<CallControls
									onLeave={() => {
										sessionStorage.removeItem("__meet_callInSession");
										sessionStorage.removeItem("__meet_settingsSession");
										localStorage.removeItem("__meet_tabSession");
										router.push("/");
									}}
								/>
							</div>

							<div className="flex items-center gap-2">
								<CopyLinkBtn url={window.location.href} type="Meeting" />

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size="icon" className="size-10">
											<LayoutListIcon className="size-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem onClick={() => setLayout("grid")}>
											Grid View
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setLayout("speaker")}>
											Speaker View
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>

								<Button
									variant="outline"
									size="icon"
									className="size-10"
									onClick={() => setShowParticipants(!showParticipants)}
								>
									<UsersIcon className="size-4" />
								</Button>

								<EndCallButton />
							</div>
						</div>
					</div>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel>
					<CodeEditor />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};

export default MeetingRoom;
