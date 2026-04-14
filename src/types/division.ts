export type IDivisionTableFilterValue = number | string;

export type IDivisionTableFilters = {
  number: number;
  name: string;
  code: string;
};

export type IDivision = {
  id_division: string;
  division_name: string;
  division_code: string;
};

export type IDivisionInput = {
  division_name?: string;
  division_code?: string;
};
