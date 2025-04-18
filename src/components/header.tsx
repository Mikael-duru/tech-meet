"use client";

import React from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";

import { ThemeToggle } from "./theme-toggle-btn";
import DashboardBtn from "./dashboard-btn";
import Logo from "./logo";
import { usePathname } from "next/navigation";

const Header = () => {
	const pathname = usePathname();

	const meetingRoom = pathname.startsWith("/meeting/");

	return (
		<header className="border-b">
			<nav className="flex h-16 items-center px-4 container mx-auto">
				{/* Logo */}
				<Logo />

				{/* Actions */}
				{!meetingRoom && (
					<SignedIn>
						<div className="flex items-center space-x-4  ml-auto">
							<DashboardBtn />
							<ThemeToggle />
							<UserButton
								appearance={{
									elements: {
										avatarBox: "w-10 h-10",
										userButtonPopoverCard: "shadow-xl",
										userPreviewMainIdentifier: "font-semibold",
									},
								}}
							/>
						</div>
					</SignedIn>
				)}
			</nav>
		</header>
	);
};

export default Header;
