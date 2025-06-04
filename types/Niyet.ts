export type LogEntry = {
	id: string;
	text: string;
	createdAt: string; // ISO date string
};

export type Niyet = {
	id: string;
	bad: string;
	good?: string;
	progress: number;
	streak: number;
	createdAt?: string; // Дата создания Ниета
	logs?: LogEntry[];
	status: 'active' | 'completed' | 'paused';
	lastMarkedDate?: string; // Для логики сброса серии (пока не реализуем)
};
