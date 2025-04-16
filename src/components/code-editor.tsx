import React, { useState } from "react";
import Image from "next/image";
import { AlertCircleIcon, FileTextIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";

import { CODING_QUESTIONS, LANGUAGES, LanguageType } from "@/constants";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const CodeEditor = () => {
	const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
	const [language, setLanguage] = useState<LanguageType>(LANGUAGES[0].id);
	const [code, setCode] = useState(selectedQuestion.starterCode[language]);

	const handleQuestionChange = (questionId: string) => {
		const question = CODING_QUESTIONS.find((q) => q.id === questionId);
		if (question) {
			setSelectedQuestion(question);
			setCode(question.starterCode[language]);
		}
	};

	const handleLanguageChange = (newLanguage: LanguageType) => {
		setLanguage(newLanguage);
		setCode(selectedQuestion.starterCode[newLanguage]);
	};

	return (
		<ResizablePanelGroup
			direction="vertical"
			className="min-h-[calc(100vh-4rem-1px)]"
		>
			{/* Questions section */}
			<ResizablePanel>
				<ScrollArea className="h-full">
					<div className="p-6">
						<div className="max-w-4xl mx-auto space-y-6">
							{/* Header */}
							<div className="flex flex-row lg:items-center justify-between flex-wrap gap-4">
								<div className="space-y-1">
									<h2 className="text-2xl font-semibold tracking-tight">
										{selectedQuestion.title}
									</h2>
									<p className="text-sm text-muted-foreground">
										Select your language and start coding
									</p>
								</div>
								<div className="flex flex-wrap sm:items-center gap-3">
									<Select
										value={selectedQuestion.id}
										onValueChange={handleQuestionChange}
									>
										<SelectTrigger className="w-[200px]">
											<SelectValue placeholder="Select question" />
										</SelectTrigger>
										<SelectContent>
											{CODING_QUESTIONS.map((q) => (
												<SelectItem key={q.id} value={q.id}>
													{q.title}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

									<Select value={language} onValueChange={handleLanguageChange}>
										<SelectTrigger className="w-[150px]">
											{/* SELECT VALUE */}
											<SelectValue>
												<div className="flex items-center gap-2">
													<Image
														src={`/${language}.png`}
														alt={language}
														width={20}
														height={20}
														className="w-5 h-5 object-contain"
													/>
													{LANGUAGES.find((l) => l.id === language)?.name}
												</div>
											</SelectValue>
										</SelectTrigger>
										{/* SELECT CONTENT */}
										<SelectContent>
											{LANGUAGES.map((lang) => (
												<SelectItem key={lang.id} value={lang.id}>
													<div className="flex items-center gap-2">
														<Image
															src={`/${lang.id}.png`}
															alt={lang.name}
															width={20}
															height={20}
															className="w-5 h-5 object-contain"
														/>
														{lang.name}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Problem description */}
							<Card>
								<CardHeader>
									<CardTitle className="flex flex-row items-center gap-2">
										<FileTextIcon className="size-5 text-primary/80 flex-shrink-0" />{" "}
										Problem Description
									</CardTitle>
								</CardHeader>
								<CardContent className="text-sm leading-relaxed">
									<div className="prose prose-sm dark:prose-invert max-w-none">
										<p className="whitespace-pre-line">
											{selectedQuestion.description}
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Problem examples */}
							<Card>
								<CardHeader>
									<CardTitle className="flex flex-row items-center gap-2">
										<LightbulbIcon className="size-5 text-yellow-500 flex-shrink-0" />{" "}
										Examples
									</CardTitle>
								</CardHeader>
								<CardContent>
									<ScrollArea className="h-full w-full rounded-md border">
										<div className="p-4 space-y-4">
											{selectedQuestion.examples.map((example, index) => (
												<div key={index} className="space-y-2">
													<p className="font-medium text-sm">
														Example {index + 1}:
													</p>
													<ScrollArea className="h-full w-full rounded-md">
														<pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono">
															<div>Input: {example.input}</div>
															<div>Output: {example.output}</div>
															{example.explanation && (
																<div className="pt-2 text-muted-foreground">
																	Explanation: {example.explanation}
																</div>
															)}
														</pre>
														<ScrollBar orientation="horizontal" />
													</ScrollArea>
												</div>
											))}
										</div>
										<ScrollBar />
									</ScrollArea>
								</CardContent>
							</Card>

							{/* CONSTRAINTS */}
							{selectedQuestion.constraints && (
								<Card>
									<CardHeader>
										<CardTitle className="flex flex-row items-center gap-2">
											<AlertCircleIcon className="size-5 text-amber-500/80 dark:text-amber-400/90 flex-shrink-0" />
											Constraints
										</CardTitle>
									</CardHeader>
									<CardContent>
										<ul className="list-disc list-inside space-y-1 text-sm marker:text-amber-500/80 dark:marker:text-amber-400/90 font-mono">
											{selectedQuestion.constraints.map((constraint, index) => (
												<li key={index} className="text-muted-foreground pl-2">
													{constraint}
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</ScrollArea>
			</ResizablePanel>

			<ResizableHandle withHandle />

			{/* Code Editor */}
			<ResizablePanel defaultSize={60} maxSize={100}>
				<div className="h-full relative">
					<Editor
						height={"100%"}
						defaultLanguage={language === "csharp" ? "c#" : language}
						language={language === "csharp" ? "c#" : language}
						theme="vs-dark"
						value={code}
						onChange={(value) => setCode(value || "")}
						options={{
							minimap: { enabled: false },
							fontSize: 16,
							lineNumbers: "on",
							scrollBeyondLastLine: false,
							automaticLayout: true,
							padding: { top: 16, bottom: 16 },
							wordWrap: "on",
							wrappingIndent: "indent",
							autoClosingBrackets: "languageDefined",
							autoClosingQuotes: "always",
							autoClosingComments: "always",
							autoIndent: "advanced",
						}}
					/>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};

export default CodeEditor;
