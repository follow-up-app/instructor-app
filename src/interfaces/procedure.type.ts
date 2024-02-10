export interface IProcedure {
    id: string;
    skill_id: string;
    name: string;
    tries: number;
    goal: number;
    period: string;
    objective: string;
    stimulus: string;
    answer: string;
    consequence: string;
    materials: string;
    help: string;
    total_exec?: number;
    data_chart?: number;
    app_active?: boolean;
}