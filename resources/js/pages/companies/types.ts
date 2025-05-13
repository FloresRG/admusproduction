// types.ts
export interface Company {
  id: number;
  name: string;
  company_category_id: number;
  contract_duration: number;
  description: string;
  category: {
    id: number;
    name: string;
  };
}

export interface CompanyCategory {
  id: number;
  name: string;
}
