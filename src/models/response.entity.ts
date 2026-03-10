export interface Response {
    status: Status;
    data: unknown;
    message: string | null;
}

export enum Status {
    OK,
    UNAUTHORIZED,
    NOT_FOUND,
}
