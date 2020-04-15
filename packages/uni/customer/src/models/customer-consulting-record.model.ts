import { UploadFile, SelectOption } from '@uni/core';
import { MarketingCustomer } from './marketing-customer.model';


export interface CustomerConsultingRecordModel {
  id: string;
  visitingPurpose: SelectOption;
  englishDegree: SelectOption;
  monthlyDisposableIncome: SelectOption;
  backgroundInfo: string;
  course: boolean;
  courseType: SelectOption;
  courseCount: string;
  courseMonth: string;
  offerPriceStatus: boolean;
  offerPrice: string;
  invalidationReason: SelectOption;
  invalidationRemark: string;
  attachments: UploadFile[];
  contractRate: SelectOption;
  reasonForAbandoning: string;
  isImportant: boolean;
  relativeMarketingCustomer: MarketingCustomer;
}
