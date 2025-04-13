import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import ConvexClerkProvider from "@/components/providers/convex-clerk-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({
	subsets: ["latin"],
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
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<ConvexClerkProvider>
						{children} <Toaster richColors />
					</ConvexClerkProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
