export type LogEntry = {
	id: string;
	text: string;
	createdAt: string;
};

export type Niyet = {
	id: string;
	bad: string;
	good?: string;
	progress: number;
	streak: number;
	createdAt?: string;
	logs?: LogEntry[];
	status: 'active' | 'completed' | 'paused';
	lastMarkedDate?: string;
	user_id: string;
};
