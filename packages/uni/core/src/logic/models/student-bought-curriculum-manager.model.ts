import { Product, ProductSubject, ProductCurriculum } from './curriculum-manager.model';
import { Employee } from './employee.model';


export interface StudentBoughtProduct extends Product {
    startTime: string;                  // 有效开始时间
    endTime: string;                    // 有效结束时间
    curriculumCount: number;            // 总课时
    remainedCurriculumCount: number;    // 剩余课时
    consumedCurriculumCount: number;    // 已消课时
    lockedCurriculumCount: number;      // 锁定课时
    overdueCurriculumCount: number;     // 过期课时
    deprecatedCurriculumCount: number;  // 作废课时
}

export interface StudentBoughtSubject extends ProductSubject {
    startTime: string;                  // 有效开始时间
    endTime: string;                    // 有效结束时间
    curriculumCount: number;            // 总课时
    remainedCurriculumCount: number;    // 剩余课时
    consumedCurriculumCount: number;    // 已消课时
    lockedCurriculumCount: number;      // 锁定课时
    overdueCurriculumCount: number;     // 过期课时
    deprecatedCurriculumCount: number;  // 作废课时
    relativeProduct: StudentBoughtProduct;
    relativeTeacher: Employee;
}

export interface StudentBoughtCurriculum extends ProductCurriculum {
    startTime: string;                  // 有效开始时间
    endTime: string;                    // 有效结束时间
    curriculumCount: number;              // 总课时
    remainedCurriculumCount: number;      // 剩余课时
    consumedCurriculumCount: number;      // 已消课时
    lockedCurriculumCount: number;        // 锁定课时
    overdueCurriculumCount: number;       // 过期课时
    deprecatedCurriculumCount: number;    // 作废课时
    relativeProduct: StudentBoughtProduct;
    relativeSubject: StudentBoughtSubject;
    relativeTeacher: Employee;
    ocId: number;                       // OCID用于区分唯一课程
}
