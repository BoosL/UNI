export interface Area {
  id: string;
  name: string;
}

export interface Bank {
  id: string;
  name: string;
  instalments: string;
}

export interface BankInstalment {
  id: string;
  label: string;
  num: number;
  rate: string;
  fee: string;
}

export interface CustomerSource {
  id: string;
  name: string;
  children: CustomerSource[];
}

export interface CustomerContactType {
  id: string;
  name: string;
}
