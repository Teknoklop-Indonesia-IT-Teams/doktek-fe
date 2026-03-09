export type IDivisionTableFilterValue = number | string;

export type IDivisionTableFilters = {
  number: number;
  name: string;
};

export type IDivision = {
  id_division: string;
  division_name: string;
};

export type IDivisionInput = {
  division_name?: string;
};
