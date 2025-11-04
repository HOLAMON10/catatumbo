export interface AgentChangingStatusDetailInterface {
    id: string;
    previousStatus: string;
    newStatus: string;
    changedBy: any;
    changingComments: string;
    creationTimestamp: number;
    commentsDetail?: {
        id: string;
        managementCommenter?: any;
        agentCommenter?: any;
        comments: string;
        commentedAt: number;
    }[]
}