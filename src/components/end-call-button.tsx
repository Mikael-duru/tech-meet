import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

const EndCallButton = () => {
	const call = useCall();
	const router = useRouter();
	const { useLocalParticipant } = useCallStateHooks();
	const localParticipant = useLocalParticipant();

	const updateInterviewStatus = useMutation(
		api.interviews.updateInterviewStatus
	);

	const interviews = useQuery(api.interviews.getInterviewByStreamCallId, {
		streamCallId: call?.id || "",
	});

	if (!call) return null;

	const isMeetingHost = localParticipant?.userId === call.state.createdBy?.id;

	if (!isMeetingHost) return null;

	const handleInterviewUpdate = async () => {
		try {
			await call.endCall();

			await updateInterviewStatus({
				id: interviews?._id as Id<"interviews">,
				status: "completed",
			});

			sessionStorage.removeItem("__callInSession");
			localStorage.removeItem("__techMeetCallSession");

			router.push("/");
			toast.success("Meeting ended for everyone!");
		} catch (error) {
			console.error(error);
			toast.error("Failed to end meeting for everyone!");
		}
	};

	const handleEndCall = async () => {
		try {
			await call.endCall();

			sessionStorage.removeItem("__callInSession");
			localStorage.removeItem("__techMeetCallSession");

			router.push("/");
			toast.success("Meeting ended for everyone!");
		} catch (error) {
			console.error(error);
			toast.error("Failed to end meeting for everyone!");
		}
	};

	return !interviews ? (
		<Button variant={"destructive"} onClick={handleEndCall}>
			End Meeting
		</Button>
	) : (
		<Button variant={"destructive"} onClick={handleInterviewUpdate}>
			End Meeting
		</Button>
	);
};

export default EndCallButton;
