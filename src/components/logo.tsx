import { CodeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
	return (
		<Link
			href="/"
			className="flex items-center gap-1 font-semibold text-2xl mr-6 font-mono hover:opacity-85 transition-opacity duration-300"
		>
			<CodeIcon className="size-10 stroke stroke-[1.8] stroke-green-400 max-sm:hidden" />
			<h1 className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent text-3xl font-bold leading-tight tracking-tighter">
				TechMeet
			</h1>
		</Link>
	);
};

export default Logo;
