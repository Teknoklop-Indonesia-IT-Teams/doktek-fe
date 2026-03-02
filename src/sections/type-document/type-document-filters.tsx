import { useCallback } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import InputAdornment from '@mui/material/InputAdornment';
// types
import { ITypeFilters, ITypeFilterValue } from 'src/types/type';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import FileThumbnail from 'src/components/file-thumbnail';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  filters: ITypeFilters;
  onFilters: (name: string, value: ITypeFilterValue) => void;
  typeOptions: string[];
};

export default function TypeManagerFilters({
  //
  filters,
  onFilters,
  typeOptions,
}: Props) {
  const popover = usePopover();

  const renderLabel = filters.code_document.length ? filters.code_document.slice(0, 2) : 'All type';

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterType = useCallback(
    (newValue: string) => {
      const checked = filters.code_document.includes(newValue)
        ? filters.code_document.filter((value) => value !== newValue)
        : [...filters.code_document, newValue];
      onFilters('code_document', checked);
    },
    [filters.code_document, onFilters]
  );

  const handleResetType = useCallback(() => {
    popover.onClose();
    onFilters('code_document', '');
  }, [onFilters, popover]);

  const renderFilterName = (
    <TextField
      value={filters.type_document}
      onChange={handleFilterName}
      placeholder="Search..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        width: { xs: 1, md: 260 },
      }}
    />
  );

  const renderFilterType = (
    <>
      <Button
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: -0.5 }}
          />
        }
      >
        {renderLabel}
        {filters.code_document.length > 2 && (
          <Label color="info" sx={{ ml: 1 }}>
            +{filters.code_document.length - 2}
          </Label>
        )}
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {typeOptions.map((code) => {
              const selected = filters.code_document.includes(code);

              return (
                <CardActionArea
                  key={code}
                  onClick={() => handleFilterType(code)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
                    ...(selected && {
                      bgcolor: 'action.selected',
                    }),
                  }}
                >
                  <Stack spacing={1} direction="row" alignItems="center">
                    <FileThumbnail file={code} />
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{code}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={handleResetType}>
              Clear
            </Button>

            <Button variant="contained" onClick={popover.onClose}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  return (
    <Stack
      spacing={1}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      sx={{ width: 1 }}
    >
      {renderFilterName}

      <Stack spacing={1} direction="row" alignItems="center" justifyContent="flex-end" flexGrow={1}>
        {renderFilterType}
      </Stack>
    </Stack>
  );
}
