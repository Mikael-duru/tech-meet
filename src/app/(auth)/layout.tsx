export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div className="px-4 flex items-center justify-center min-h-svh w-full py-10">
				{children}
			</div>

			<footer className="bg-muted/50 py-10">
				<p className="container mx-auto px-4 text-center text-muted-foreground">
					Made with ❤️ by Mikael Duru.
				</p>
			</footer>
		</>
	);
}
