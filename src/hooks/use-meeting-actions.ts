import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useMeetingActions = () => {
	const router = useRouter();
	const client = useStreamVideoClient();

	const createInstantMeeting = async () => {
		if (!client) return;

		try {
			const id = crypto.randomUUID();
			const call = client.call("default", id);

			await call.getOrCreate({
				data: {
					starts_at: new Date().toISOString(),
					custom: {
						description: "Instant Meeting",
					},
				},
			});

			router.push(`/meeting/${call.id}`);
			toast.success("Meeting created successfully! 🎉", {
				id: "create-meeting",
			});
		} catch (error) {
			console.log("Error creating meeting", error);
			toast.error("Failed to create meeting", { id: "create-meeting" });
		}
	};

	const joinMeeting = async (callId: string) => {
		if (!client) {
			return toast.error("Failed to join meeting. Please try again");
		}

		try {
			// call existence check
			const call = client.call("default", callId);
			const { call: callInfo } = await call.get(); // This verifies the meeting exists

			if (callInfo) {
				toast.dismiss("join-meeting");
				router.push(`/meeting/${callId}`);
			}
		} catch (error) {
			console.error("Invalid meeting ID or call not found", error);
			toast.error(
				"Invalid meeting ID or call not found. Please check the link or ID.",
				{
					id: "join-meeting",
				}
			);
		}
	};

	return {
		createInstantMeeting,
		joinMeeting,
	};
};

export default useMeetingActions;
