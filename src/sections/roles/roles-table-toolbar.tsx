import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// types
import { IRoleTableFilters, IRoleTableFilterValue } from 'src/types/role';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  filters: IRoleTableFilters;
  onFilters: (name: string, value: IRoleTableFilterValue) => void;
  serviceOptions: string[];
};

export default function RoleTableToolbar({ filters, onFilters, serviceOptions }: Props) {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('role_name', event.target.value);
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          fullWidth
          value={filters.role_name}
          onChange={handleFilterName}
          placeholder="Search role name..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Stack>
  );
}
