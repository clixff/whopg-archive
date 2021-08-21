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
}

export interface IStreamer
{
    name: string;
    color: string;
    games: Array<IGame>;
}

export type WhoPGEvent = Array<IStreamer>;