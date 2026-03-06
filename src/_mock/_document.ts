import { add, subDays } from 'date-fns';
//
import { _mock } from './_mock';
import { _addressBooks } from './_others';

// ----------------------------------------------------------------------

export const DOCUMENT_DIVISION_OPTIONS = [
  { value: 'automation', label: 'Automation' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'rnd', label: 'RnD' },
  { value: 'it', label: 'IT Engineer' },
];

export const _document = [...Array(20)].map((_, index) => {
  const status =
    (index % 2 && 'automation') || (index % 3 && 'laboratory') || (index % 4 && 'rnd') || 'it';

  return {
    id: _mock.id(index),
    status,
    document_number: `DOC-${index}`,
    created_at: subDays(new Date(), index),
  };
});
