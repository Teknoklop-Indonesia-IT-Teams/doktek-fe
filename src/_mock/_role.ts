import { add, subDays } from 'date-fns';
//
import { _mock } from './_mock';
import { _addressBooks } from './_others';
import { IRole } from 'src/types/role';

// ----------------------------------------------------------------------

export const ROLE_NAME = [
  { value: 'Super Admin', label: 'Super Admin' },
  { value: 'Admin', label: 'Admin' },
  { value: 'User', label: 'User' },
];

export const _role: IRole[] = [...Array(20)].map((_, index) => {
  const roles = ['Super Admin', 'Admin', 'User'];

  return {
    id_role: index + 1,
    role_name: roles[index % roles.length],
  };
});
