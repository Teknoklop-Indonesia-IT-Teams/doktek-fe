// ----------------------------------------------------------------------

import { IDivision } from './division';
import { ITypeDocument } from './type';

export type IDocumentTableFilterValue = string | string | Date | Date | string;

export type IDocumentTableFilters = {
  document_number: string;
  job_title: string;
  created_at: Date | null;
  updated_at: Date | null;
  id_division: string;
};

export type IDocumentItemTableFilterValue = string | string | Date | Date | string | string;

export type IDocumentItemTableFilters = {
  document_number: string;
  document_file: string;
  created_at: Date | null;
  updated_at: Date | null;
  id_technical_document: string;
  id_type_document: string;
};

// ----------------------------------------------------------------------

export type IDocumentItem = {
  id_technical_document_item: number;
  document_number: string;
  document_file: (File | string)[] | null;
  created_at: string;
  updated_at: string;
  technicalDocument: IDocument;
  typeDocument: ITypeDocument;
};

export type IDocumentItemsInput = {
  document_file?: (File | string)[];
  id_type_manager?: number;
  id_technical_document?: number;
};

export type IDocument = {
  id_technical_document: number;
  document_number: string;
  job_title: string;
  created_at: string;
  updated_at: string;
  division: IDivision;
  items: IDocumentItem[];
};

export type IDocumentInput = {
  job_title?: string;
  id_division?: number;
};
