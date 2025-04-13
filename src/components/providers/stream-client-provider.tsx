"use client";

import React, { useEffect, useState } from "react";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";

import LoaderUI from "../loader-ui";
import { streamTokenProvider } from "@/actions/stream.actions";

const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
	const [streamVideoClient, setStreamVideoClient] =
		useState<StreamVideoClient>();
	const { user, isLoaded } = useUser();

	useEffect(() => {
		if (!user || !isLoaded) {
			return;
		}

		const client = new StreamVideoClient({
			apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
			user: {
				id: user?.id,
				name: user?.firstName || "" + " " + user?.lastName || "" || user?.id,
				image: user?.imageUrl,
			},
			tokenProvider: streamTokenProvider,
		});

		setStreamVideoClient(client);
	}, [user, isLoaded]);

	if (!streamVideoClient) return <LoaderUI />;
	// <div className="flex justify-center items-center h-screen w-full bg-background">
	//         <div className="h-20 w-full animate-bounce flex justify-center items-center">
	//           <Logo />
	//         </div>
	//       </div>

	return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
