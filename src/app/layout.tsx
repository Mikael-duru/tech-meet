import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import ConvexClerkProvider from "@/components/providers/convex-clerk-provider";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "TechMeet",
	description:
		"TechMeet is designed for developers, merging video interviews with an intuitive coding interface. Conduct live coding sessions, share instant feedback, and engage with candidates on a deeper level.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ConvexClerkProvider>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					{children}
				</body>
			</html>
		</ConvexClerkProvider>
	);
}
