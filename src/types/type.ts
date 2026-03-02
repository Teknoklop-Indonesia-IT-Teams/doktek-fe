// ----------------------------------------------------------------------

export type ITypeFilterValue = string | string[];

export type ITypeFilters = {
  type_document: string;
  code_document: string[];
};

// ----------------------------------------------------------------------

export type ITypeManager = {
  id: string;
  type_document: string;
  code_document: string;
};
