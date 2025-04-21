"use client";

import React, { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { MessageSquareIcon, StarIcon } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { getInterviewerInfo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format } from "date-fns";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

type Props = {
	interviewId: Id<"interviews">;
	onOpenChange?: (isOpen: boolean) => void;
};

const CommentDialog = ({ interviewId, onOpenChange }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [comment, setComment] = useState("");
	const [commentErr, setCommentErr] = useState(false);
	const [rating, setRating] = useState("3");

	const addComment = useMutation(api.comments.addComment);
	const users = useQuery(api.users.getUsers);
	const existingComments = useQuery(api.comments.getComments, {
		interviewId,
	});

	if (!onOpenChange) {
		onOpenChange = (isOpen: boolean) => setIsOpen(isOpen);
	}

	const handleOpen = () => {
		setIsOpen(true);
		onOpenChange(true);
	};

	const handleClose = () => {
		setIsOpen(false);
		onOpenChange(false);
	};

	const handleSubmit = async () => {
		if (!comment.trim()) {
			setCommentErr(true);
			return toast.error("Please enter a comment.", {
				id: "comment",
			});
		}

		try {
			await addComment({
				interviewId,
				content: comment.trim(),
				rating: parseInt(rating),
			});

			toast.success("Comment Submitted", {
				id: "comment",
			});
			setComment("");
			setRating("3");
			handleClose();
		} catch (error) {
			console.log("Error adding comment", error);
			toast.error("Failed to submit comment", {
				id: "comment",
			});
		}
	};

	const renderStars = (rating: number) => (
		<div className="flex gap-0.5">
			{[1, 2, 3, 4, 5].map((starValue) => (
				<StarIcon
					key={starValue}
					className={`h-4 w-4 ${starValue <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
				/>
			))}
		</div>
	);

	if (existingComments === undefined || users === undefined) return null;

	return (
		<Dialog open={isOpen} onOpenChange={handleOpen}>
			<DialogTrigger asChild>
				<Button variant="secondary" className="w-full">
					<MessageSquareIcon className="h-4 w-4" />
					Comment
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[600px] max-h-svh overflow-y-auto">
				{/* Header */}
				<DialogHeader className="pb-4">
					<DialogTitle>Candidate Review</DialogTitle>
				</DialogHeader>

				{/* Comments */}
				<div className="space-y-6">
					{existingComments.length > 0 && (
						<div className="space-y-4">
							<h4 className="text-sm font-medium flex items-center gap-4">
								Previous comments
								<Badge variant="outline">{existingComments.length}</Badge>
							</h4>

							{/* Comments display */}
							<ScrollArea className="h-[240px]">
								<div className="space-y-4">
									{existingComments.map((comment, index) => {
										const interviewer = getInterviewerInfo(
											users,
											comment.interviewerId
										);
										return (
											<div
												key={index}
												className="rounded-lg border p-4 space-y-3"
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<Avatar className="h-8 w-8">
															<AvatarImage src={interviewer.image} />
															<AvatarFallback>
																{interviewer.initials}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="text-sm font-medium">
																{interviewer.name}
															</p>
															<p className="text-xs text-muted-foreground">
																{format(
																	comment._creationTime,
																	"MMM d, yyyy • h:mm a"
																)}
															</p>
														</div>
													</div>
													{renderStars(comment.rating)}
												</div>
												<p className="text-sm text-muted-foreground">
													{comment.content}
												</p>
											</div>
										);
									})}
								</div>
							</ScrollArea>
						</div>
					)}

					<div className="space-y-4">
						{/* Rating */}
						<div className="space-y-2">
							<Label>Rating</Label>
							<Select value={rating} onValueChange={setRating}>
								<SelectTrigger>
									<SelectValue placeholder="Select rating" />
								</SelectTrigger>
								<SelectContent>
									{[1, 2, 3, 4, 5].map((value) => (
										<SelectItem key={value} value={value.toString()}>
											<div className="flex items-center gap-2">
												{renderStars(value)}
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Comment box */}
						<div className="space-y-2">
							<Label className={`${commentErr && "text-red-500"}`}>
								Candidate Evaluation
							</Label>
							<Textarea
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								placeholder="Provide a detailed assessment of the candidate's strengths, weaknesses, and overall impression..."
								className={`${
									commentErr &&
									"border-red-500 focus:ring-red-500 focus:border-red-500"
								} "h-32 placeholder:text-sm"`}
							/>
						</div>
					</div>
				</div>

				{/* CTAs */}
				<DialogFooter className="gap-y-5">
					<Button variant="outline" onClick={handleClose}>
						Cancel
					</Button>
					<Button onClick={handleSubmit}>Submit</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CommentDialog;
