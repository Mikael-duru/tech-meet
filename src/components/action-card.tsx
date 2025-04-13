import React from "react";

import { QuickActionType } from "@/constants";
import { Card } from "./ui/card";

// SOME WEIRD TW BUG - this is how to make the gradients from @constants works
// from-emerald-500/10 via-emerald-500/5 to-transparent
// from-cyan-500/10 via-cyan-500/5 to-transparent
// from-violet-500/10 via-violet-500/5 to-transparent
// from-amber-500/10 via-amber-500/5 to-transparent

type ActionCardProps = {
	action: QuickActionType;
	onClick: () => void;
};

const ActionCard = ({ action, onClick }: ActionCardProps) => {
	return (
		<Card
			className="group relative overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
			onClick={onClick}
		>
			{/* gradient */}
			<div
				className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-100 group-hover:opacity-50 transition-opacity
					`}
			/>

			{/* content */}
			<div className="relative p-6 size-full">
				<div className="space-y-3">
					<div
						className={`w-12 h-12 rounded-full flex items-center justify-center bg-${action.color}/10 group-hover:scale-110 transition-transform`}
					>
						<action.icon className={`w-6 h-6 text-${action.color}`} />
					</div>

					<div className="space-y-1">
						<h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
							{action.title}
						</h3>
						<p className="text-sm text-muted-foreground">
							{action.description}
						</p>
					</div>
				</div>
			</div>
		</Card>
	);
};

export default ActionCard;
