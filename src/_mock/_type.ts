import { _mock } from './_mock';
import { _tags } from './assets';

// ----------------------------------------------------------------------
const TYPES = [
  'Manual Book (User Manual)',
  'Standard Operating Procedure',
  'Technical Specification (Spesifikasi Teknis)',
  'System Documentation',
  'API Documentation',
  'Installation Guide',
  'Maintenance & Troubleshooting Guide',
  'Certificate',
];

export const CODE_TYPE_OPTIONS = [
  'Manual Book',
  'SOP',
  'Technical',
  'System Documentation',
  'API Documentation',
  'Installation Guide',
  'MTG',
  'CERT',
];

// ----------------------------------------------------------------------

export const _types = TYPES.map((type_document, index) => ({
  id: `${_mock.id(index)}_file`,
  type_document,
  code_document: '',
}));

export const _allTypes = [..._types];
