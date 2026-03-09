// ----------------------------------------------------------------------

export type ITypeFilterValue = string | string[];

export type ITypeFilters = {
  type_document: string;
  code_document: string[];
};

// ----------------------------------------------------------------------

export type ITypeDocument = {
  id_type_document: string;
  type_document: string;
  code_document: string;
};

export type ITypeDocumentInput = {
  type_document?: string;
  code_document?: string;
};
