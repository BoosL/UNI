import { School, UploadFile } from '@uni/core';



export interface StudentFollows {
    id: string;
    name: string;
    nextTime: string;
    record: string;
    followPerson: string;
    createData: string;
    recording: string;
    school: School;
    remark: string;
    nextData: Date;
}

export interface StudentScFollows {
    id: string;
    relativeStudent: string;
    theme: StudentFollowsTheme;
    nextTime: string;
    remark: string;
}

export interface StudentCcFollows {
    id: string;
    nextTime: string;
    remark: string;
    attachments: UploadFile[];
}


export interface StudentFollowsTheme {
    title: string;
    type: number;
}







