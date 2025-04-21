"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "../../../../../convex/_generated/dataModel";
import CommentDialog from "@/components/comment-dialog";
import { format } from "date-fns";
import UserInfo from "@/components/user-info";
import { Checkbox } from "@/components/ui/checkbox";

export type InterviewOutcome = Doc<"interviews">;

export const columns: ColumnDef<InterviewOutcome>[] = [
	// for row selection
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="hidden"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="hidden"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "candidateId",
		header: "Candidates",
		cell: ({ row }) => {
			return (
				<div className="text-right">
					<UserInfo userId={row.getValue("candidateId")} />
				</div>
			);
		},
	},
	{
		accessorKey: "title",
		header: () => <div className="text-center">Title</div>,
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
		cell: ({ row }) => {
			return <div className="text-center">{row.getValue("title")}</div>;
		},
	},
	{
		accessorKey: "startTime",
		header: () => <div className="text-center">Interview Time</div>,
		cell: ({ row }) => {
			const formattedTime = format(
				new Date(row.getValue("startTime")),
				"MMM d, yyyy · h:mm a"
			);
			return <div className="text-center">{formattedTime}</div>;
		},
	},
	{
		accessorKey: "status",
		header: () => <div className="text-center">Status</div>,
		cell: ({ row }) => {
			return (
				<div
					className={`text-center p-2 capitalize rounded-md shadow-md ${row.getValue("status") === "passed" ? "text-emerald-50 border border-emerald-600 dark:bg-emerald-500/40 bg-emerald-500" : "text-rose-50 border border-rose-600 dark:bg-rose-500/40 bg-rose-500"}`}
				>
					{row.getValue("status")}
				</div>
			);
		},
	},
	{
		accessorKey: "actions",
		header: () => <div className="text-center">Actions</div>,
		cell: ({ row }) => (
			<CommentDialog
				interviewId={row.original._id}
				onOpenChange={(isOpen) => {
					if (isOpen) {
						// Select this row when dialog opens
						row.toggleSelected(true);
					} else {
						// Deselect when dialog closes
						row.toggleSelected(false);
					}
				}}
			/>
		),
	},
];
