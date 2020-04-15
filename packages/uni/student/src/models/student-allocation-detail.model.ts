import { SelectOption } from '@uni/core';


export interface StudentAllocationDetail {
    id: string;
    time: string;
    type: SelectOption;
    old: string;
    new: string;
    operator: string;
}
