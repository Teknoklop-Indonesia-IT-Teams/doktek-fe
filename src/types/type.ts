// ----------------------------------------------------------------------

export type ITypeFilterValue = string | string[];

export type ITypeFilters = {
  type_document: string;
  code_document: string[];
};

// ----------------------------------------------------------------------

export type ITypeManager = {
  id_type_document: string;
  type_document: string;
  code_document: string;
};

export type IType = ITypeManager;
