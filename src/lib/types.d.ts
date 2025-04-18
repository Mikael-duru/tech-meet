import { Doc, Id } from "../../convex/_generated/dataModel";

declare type Interview = Doc<"interviews">;
declare type User = Doc<"users">;

declare type InterviewFormType = {
	id: Id<"interviews">;
	title: string;
	description: string;
	date: Date;
	time: string;
	candidateId: string;
	interviewerIds: string[];
};
