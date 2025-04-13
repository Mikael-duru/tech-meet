import { CodeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Logo = () => {
	return (
		<Link
			href="/"
			className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-85 transition-opacity duration-300"
		>
			<CodeIcon className="size-8 stroke stroke-[1.6] stroke-emerald-500" />
			<p className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent font-bold leading-tight tracking-tighter">
				TechMeet
			</p>
		</Link>
	);
};

export default Logo;
