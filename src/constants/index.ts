import { Clock, Code2, Calendar, Users } from "lucide-react";

export const INTERVIEW_CATEGORY = [
	{ id: "upcoming", title: "Upcoming Interviews", variant: "outline" },
	{ id: "completed", title: "Completed", variant: "secondary" },
	{ id: "succeeded", title: "Succeeded", variant: "default" },
	{ id: "failed", title: "Failed", variant: "destructive" },
] as const;

export const TIME_SLOTS = [
	"09:00",
	"09:30",
	"10:00",
	"10:30",
	"11:00",
	"11:30",
	"12:00",
	"12:30",
	"13:00",
	"13:30",
	"14:00",
	"14:30",
	"15:00",
	"15:30",
	"16:00",
	"16:30",
	"17:00",
];

export const QUICK_ACTIONS = [
	{
		icon: Code2,
		title: "New Call",
		description: "Start an instant call",
		color: "emerald-500",
		gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
	},
	{
		icon: Users,
		title: "Join Interview",
		description: "Enter via invitation link or ID",
		color: "cyan-500",
		gradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
	},
	{
		icon: Calendar,
		title: "Schedule",
		description: "Plan upcoming interviews",
		color: "violet-500",
		gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
	},
	{
		icon: Clock,
		title: "Recordings",
		description: "Access past interviews",
		color: "amber-500",
		gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
	},
];

export const CODING_QUESTIONS: CodeQuestion[] = [
	{
		id: "sum-of-two-numbers",
		title: "Sum of Two Numbers",
		description: "Given two integers `a` and `b`, return their sum.",
		examples: [
			{ input: "a = 2, b = 3", output: "5" },
			{ input: "a = -1, b = 1", output: "0" },
		],
		starterCode: {
			javascript: `function sum(a, b) {\n  // Your code here\n}`,
			python: `def sum(a, b):\n    # Your code here\n    pass`,
			java: `class Solution {\n    public int sum(int a, int b) {\n        // Your code here\n    }\n}`,
			csharp: `public class Solution {\n    public int Sum(int a, int b) {\n        // Your code here\n    }\n}`,
			php: `function sum($a, $b) {\n    // Your code here\n}`,
			"c++": `class Solution {\npublic:\n    int sum(int a, int b) {\n        // Your code here\n    }\n};`,
		},
		constraints: ["-1000 ≤ a, b ≤ 1000"],
	},
	{
		id: "reverse-string",
		title: "Reverse String",
		description:
			"Given a string `s`, reverse it in-place (modify the original string).",
		examples: [
			{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
			{
				input: 's = ["H","a","n","n","a","h"]',
				output: '["h","a","n","n","a","H"]',
			},
		],
		starterCode: {
			javascript: `function reverseString(s) {\n  // Your code here\n}`,
			python: `def reverseString(s):\n    # Your code here\n    pass`,
			java: `class Solution {\n    public void reverseString(char[] s) {\n        // Your code here\n    }\n}`,
			csharp: `public class Solution {\n    public void ReverseString(char[] s) {\n        // Your code here\n    }\n}`,
			php: `function reverseString(&$s) {\n    // Your code here\n}`,
			"c++": `class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Your code here\n    }\n};`,
		},
		constraints: ["1 ≤ s.length ≤ 10^5", "s[i] is a printable ascii character"],
	},
	{
		id: "fibonacci-sequence",
		title: "Fibonacci Sequence",
		description:
			"Given a number `n`, return the nth element in the Fibonacci sequence (0-indexed).",
		examples: [
			{
				input: "n = 5",
				output: "5",
				explanation: "Sequence: 0, 1, 1, 2, 3, 5",
			},
			{ input: "n = 8", output: "21" },
		],
		starterCode: {
			javascript: `function fibonacci(n) {\n  // Your code here\n}`,
			python: `def fibonacci(n):\n    # Your code here\n    pass`,
			java: `class Solution {\n    public int fibonacci(int n) {\n        // Your code here\n    }\n}`,
			csharp: `public class Solution {\n    public int Fibonacci(int n) {\n        // Your code here\n    }\n}`,
			php: `function fibonacci($n) {\n    // Your code here\n}`,
			"c++": `class Solution {\npublic:\n    int fibonacci(int n) {\n        // Your code here\n    }\n};`,
		},
		constraints: ["0 ≤ n ≤ 30", "Result fits in 32-bit integer"],
	},
	{
		id: "valid-parentheses",
		title: "Valid Parentheses",
		description:
			"Determine if a string containing '(){}[]' is valid (properly nested and closed).",
		examples: [
			{ input: 's = "()"', output: "true" },
			{ input: 's = "(]"', output: "false" },
		],
		starterCode: {
			javascript: `function isValid(s) {\n  // Your code here\n}`,
			python: `def is_valid(s):\n    # Your code here\n    pass`,
			java: `class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n    }\n}`,
			csharp: `public class Solution {\n    public bool IsValid(string s) {\n        // Your code here\n    }\n}`,
			php: `function isValid($s) {\n    // Your code here\n}`,
			"c++": `class Solution {\npublic:\n    bool isValid(string s) {\n        // Your code here\n    }\n};`,
		},
	},
	{
		id: "binary-search",
		title: "Binary Search",
		description:
			"Given a sorted integer array `nums` and target value, return the index of target or -1 if not found.",
		examples: [
			{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
			{ input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
		],
		starterCode: {
			javascript: `function binarySearch(nums, target) {\n  // Your code here\n}`,
			python: `def binary_search(nums, target):\n    # Your code here\n    pass`,
			java: `class Solution {\n    public int binarySearch(int[] nums, int target) {\n        // Your code here\n    }\n}`,
			csharp: `public class Solution {\n    public int BinarySearch(int[] nums, int target) {\n        // Your code here\n    }\n}`,
			php: `function binarySearch($nums, $target) {\n    // Your code here\n}`,
			"c++": `class Solution {\npublic:\n    int binarySearch(vector<int>& nums, int target) {\n        // Your code here\n    }\n};`,
		},
		constraints: [
			"1 ≤ nums.length ≤ 10^4",
			"-10^4 ≤ nums[i], target ≤ 10^4",
			"nums is sorted in ascending order",
		],
	},
	{
		id: "coin-change",
		title: "Coin Change",
		description:
			"Given coins of different denominations and an amount, return the fewest coins needed to make up that amount.",
		examples: [
			{
				input: "coins = [1,2,5], amount = 11",
				output: "3",
				explanation: "5 + 5 + 1 = 11",
			},
			{ input: "coins = [2], amount = 3", output: "-1" },
		],
		starterCode: {
			javascript: `function coinChange(coins, amount) {\n  // Your code here\n}`,
			python: `def coin_change(coins, amount):\n    # Your code here\n    pass`,
			java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Your code here\n    }\n}`,
			csharp: `public class Solution {\n    public int CoinChange(int[] coins, int amount) {\n        // Your code here\n    }\n}`,
			php: `function coinChange($coins, $amount) {\n    // Your code here\n}`,
			"c++": `class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Your code here\n    }\n};`,
		},
		constraints: ["1 ≤ coins.length ≤ 12", "0 ≤ amount ≤ 10^4"],
	},
];

export const LANGUAGES = [
	{ id: "csharp", name: "C#", icon: "/csharp.png" },
	{ id: "c++", name: "C++", icon: "/c++.png" },
	{ id: "java", name: "Java", icon: "/java.png" },
	{ id: "javascript", name: "JavaScript", icon: "/javascript.png" },
	{ id: "php", name: "PHP", icon: "/php.png" },
	{ id: "python", name: "Python", icon: "/python.png" },
] as const;

export interface CodeQuestion {
	id: string;
	title: string;
	description: string;
	examples: Array<{
		input: string;
		output: string;
		explanation?: string;
	}>;
	starterCode: {
		javascript: string;
		python: string;
		java: string;
		csharp: string;
		php: string;
		"c++": string;
	};
	constraints?: string[];
}

export type LanguageType = (typeof LANGUAGES)[number]["id"];

export type QuickActionType = (typeof QUICK_ACTIONS)[number];
