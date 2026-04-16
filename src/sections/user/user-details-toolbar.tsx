// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import type { StackProps } from '@mui/material/Stack';
import Stack from '@mui/material/Stack';
// components
import { RouterLink } from 'src/routes/components';
import SvgColor from 'src/components/svg-color';
import { useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/app/${name}.svg`} sx={{ width: '16px', height: '16px' }} />
);

const ICONS = {
  back: icon('ic_back'),
};

type Props = StackProps & {
  backLink: string;
};

export default function UserDetailsToolbar({ backLink, sx, ...other }: Props) {
  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >
        <LoadingButton
          component={RouterLink}
          href={backLink}
          startIcon={ICONS.back}
          variant="contained"
          size="small"
        >
          Back
        </LoadingButton>

        <Box sx={{ flexGrow: 1 }} />
      </Stack>
    </>
  );
}
