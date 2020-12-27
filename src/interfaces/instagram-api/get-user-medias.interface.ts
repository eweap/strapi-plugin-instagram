export interface InstagramGetUserMedias {
    data: string[];
    paging: {
        cursors: {
            after: string;
            before: string;
        };
        next: string;
    };
}
