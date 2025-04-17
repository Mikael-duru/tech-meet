import React from "react";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";

import { Button } from "./ui/button";

const CopyLinkBtn = ({ url, type }: { url: string; type: string }) => {
	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(url);
			toast.success(`${type} link copied to clipboard`);
		} catch (error) {
			console.error("Failed to copy link to clipboard", error);
			toast.error("Failed to copy link to clipboard");
		}
	};

	return (
		<Button variant="secondary" onClick={handleCopyLink}>
			<span className="max-sm:sr-only">
				{type === "Meeting" && "Meeting link"}
			</span>
			<CopyIcon className="size-4" />
		</Button>
	);
};

export default CopyLinkBtn;
