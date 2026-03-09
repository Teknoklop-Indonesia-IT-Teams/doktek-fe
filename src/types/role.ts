export type IRoleTableFilterValue = number | string;

export type IRoleTableFilters = {
  number: number;
  role_name: string;
};

export type IRole = {
  id_role: string;
  role_name: string;
};

export type IRoleInput = {
  role_name?: string;
};
