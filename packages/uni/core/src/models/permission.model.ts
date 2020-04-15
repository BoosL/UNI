export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Permission {
    method: RequestMethod | RequestMethod[];
    apiUrl: string;
}
