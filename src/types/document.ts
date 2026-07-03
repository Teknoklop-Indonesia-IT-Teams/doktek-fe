// ----------------------------------------------------------------------

import { IDivision } from './division';
import { ITypeDocument } from './type';

export type IDocumentTableFilterValue = string | Date | Date | string | string | string;

export type IDocumentTableFilters = {
  title: string;
  created_at: Date | null;
  updated_at: Date | null;
  id_division: string;
  id_type_document: string;
  document_number: string;
};

// ----------------------------------------------------------------------

export type IDocument = {
  id_technical_document: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  activities: IDocumentActivity[];
};

export type IDocumentActivity = {
  id_technical_document: number;
  id_technical_document_activity: number;
  title: string;
  document_number: string;
  flag_active: number;
  version_number: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  division: IDivision;
  typeDocument: ITypeDocument;
  document_file_pdf?: string | null;
  document_file?: string | null;
};

export type IDocumentById = {
  id_technical_document: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  activities: IDocumentActivity[];
  document_file_pdf?: string | null;
  document_file?: string | null;
};

export type IDocumentInput = {
  title?: string;
  id_division?: number;
  id_type_document?: number;
  document_file?: string;
};
