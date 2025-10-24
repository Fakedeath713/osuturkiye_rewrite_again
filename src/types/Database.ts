export type News = {
    id: number,
    title: string,
    description: string,
    author: string,
    date: Date,
    content: string,
};

export type Event = {
    mode: string,
    title: string,
    host: string,
    date: Date,
};

export type RecentPlay = {
    player: string,
    avatar: string,
    playedmap: string,
    mapper: string,
    pp: number,
};

