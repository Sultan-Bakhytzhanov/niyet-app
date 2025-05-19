export type Niyet = {
	id: string;
	bad: string;
	good?: string;
	progress: number;
	streak: number;
	createdAt?: string;
	// можно добавить ещё нужные поля
};
