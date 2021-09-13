export enum EGameStatus
{
    Completed,
    Drop,
    Reroll
}

export interface IGame
{
    name: string;
    url: string;
    status: EGameStatus;
    comment: string;
    key: string;
    tracker?: {
        /** Link to twitchtracker page */
        link: string,
        /** Number of hours played */
        time: number
    }
}

export interface IStreamer
{
    name: string;
    color: string;
    games: Array<IGame>;
    stats: {
        total: number,
        completed: number,
        drop: number,
        reroll: number
    },
    coreTime?: string
}

export type WhoPGEvent = Array<IStreamer>;