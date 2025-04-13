import Header from "@/components/header";

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="w-full min-h-screen">
			<Header />

			<main className="px-4 sm:px-6 lg:px-8">{children}</main>
		</div>
	);
}
