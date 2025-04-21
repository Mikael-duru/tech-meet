"use client";

import { CallRecording } from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { VideotapeIcon } from "lucide-react";

import useGetCalls from "@/hooks/use-get-calls";
import LoaderUI from "./loader-ui";
import { ScrollArea } from "./ui/scroll-area";
import RecordingCard from "./recording-card";

const Recordings = () => {
	const { calls, isLoading } = useGetCalls();
	const [recordings, setRecordings] = useState<CallRecording[]>([]);
	const [recordingsLoading, setRecordingsLoading] = useState(true);

	useEffect(() => {
		const fetchRecordings = async () => {
			if (!calls) return;

			try {
				setRecordingsLoading(true);
				// Get recordings for each call
				const callData = await Promise.all(
					calls.map((call) => call.queryRecordings())
				);

				const allRecordings = callData.flatMap((call) => call.recordings);

				setRecordings(allRecordings);
			} catch (error) {
				console.log("Error fetching recordings", error);
			} finally {
				setRecordingsLoading(false);
			}
		};

		fetchRecordings();
	}, [calls]);

	const sortedRecordings = recordings?.sort((a, b) => {
		const dateA = new Date(a.start_time).getTime();
		const dateB = new Date(b.start_time).getTime();
		return dateA - dateB;
	});

	if (isLoading || recordingsLoading) return <LoaderUI />;

	return (
		<div className="container max-w-7xl mx-auto py-6">
			{/* Header */}
			<h1 className="text-3xl font-bold">Recordings</h1>
			{sortedRecordings.length > 0 && (
				<p className="text-muted-foreground my-1">
					{sortedRecordings.length}{" "}
					{sortedRecordings.length === 1 ? "recording" : "recordings"} available
				</p>
			)}

			{/* Recording grid */}
			<ScrollArea className="h-[calc(100vh-12rem)] mt-3">
				{sortedRecordings.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
						{sortedRecordings.map((r) => (
							<RecordingCard key={r.end_time} recording={r} />
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-[400px] gap-4">
						<VideotapeIcon className="stroke stroke-[1.5] stroke-red-500 mb-4 size-12 md:size-16" />
						<p className="text-xl font-medium text-muted-foreground">
							No recordings available
						</p>
					</div>
				)}
			</ScrollArea>
		</div>
	);
};

export default Recordings;
