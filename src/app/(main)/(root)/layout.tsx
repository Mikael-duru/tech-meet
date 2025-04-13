import StreamClientProvider from "@/components/providers/stream-client-provider";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <StreamClientProvider>{children}</StreamClientProvider>;
}
