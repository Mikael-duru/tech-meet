"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";

import ActionCard from "@/components/action-card";
import { QUICK_ACTIONS } from "@/constants";
import { UseUserRole } from "@/hooks/use-user-role";
import { api } from "../../../../convex/_generated/api";
import MeetingModal from "@/components/meeting-modal";
import LoaderUI from "@/components/loader-ui";

export default function Home() {
	const router = useRouter();
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState<"start" | "join">();

	const { isInterviewer, isLoading } = UseUserRole();
	const interviews = useQuery(api.interviews.getMyInterviews);

	const handleQuickAction = (title: string) => {
		switch (title) {
			case "New Call":
				setModalType("start");
				setShowModal(true);
				break;
			case "Join Interview":
				setModalType("join");
				setShowModal(true);
				break;
			default:
				router.push(`/${title.toLowerCase()}`);
		}
	};

	if (isLoading) {
		return <LoaderUI />;
	}

	return (
		<div className="container mx-auto max-w-7xl p-6">
			{/* Welcome message */}
			<section className="rounded-lg bg-card p-6 border shadow-sm mb-10">
				<h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
					Welcome back!
				</h1>
				<p className="text-muted-foreground mt-2">
					{isInterviewer
						? "Manage your interviews and review candidates effectively"
						: "Access your upcoming interviews and preparations"}
				</p>
			</section>

			{isInterviewer ? (
				<>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{QUICK_ACTIONS.map((action) => (
							<ActionCard
								key={action.title}
								action={action}
								onClick={() => handleQuickAction(action.title)}
							/>
						))}
					</div>

					<MeetingModal
						isOpen={showModal}
						onClose={() => setShowModal(false)}
						title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
						isJoinMeeting={modalType === "join"}
					/>
				</>
			) : (
				<></>
			)}
		</div>
	);
}
