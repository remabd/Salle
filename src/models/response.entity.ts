export interface Response<T = null> {
    status: Status;
    data: T | null;
    message: string | null;
}

export enum Status {
    OK,
    UNAUTHORIZED,
    NOT_FOUND,
    INTERNAL,
}
