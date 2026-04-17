// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack, { StackProps } from '@mui/material/Stack';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
// utils
// types
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { Typography } from '@mui/material';
import { IDocumentActivity } from 'src/types/document';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  file: IDocumentActivity;
}

export default function FileDocumentRecent({ file, sx, ...other }: Props) {
  const { title } = file;
  const getFileExtension = (file?: string) => {
    if (!file) return '';

    return file.split('.').pop()?.toLowerCase();
  };
  const getFileConfig = (ext?: string) => {
    switch (ext) {
      case 'pdf':
        return {
          icon: 'vscode-icons:file-type-pdf2',
          color: '#f44336',
        };
      case 'doc':
      case 'docx':
        return {
          icon: 'vscode-icons:file-type-word',
          color: '#2196f3',
        };
      case 'xls':
      case 'xlsx':
        return {
          icon: 'vscode-icons:file-type-excel',
          color: '#4caf50',
        };
      default:
        return {
          icon: 'solar:file-text-bold',
          color: '#9e9e9e',
        };
    }
  };

  const ext = getFileExtension(file.document_file);
  const { icon, color } = getFileConfig(ext);

  return (
    <>
      <Stack
        component={Paper}
        variant="outlined"
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          borderRadius: 2,
          p: 1.5,
          minWidth: 220,
          flexShrink: 0,
          borderLeft: `4px solid ${color}`,
          ...sx,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            bgcolor: `${color}20`, // transparan
          }}
        >
          <Iconify icon={icon} width={22} />
        </Box>

        <Stack sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>

          <Typography variant="caption" color="text.secondary" noWrap>
            {ext?.toUpperCase()}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}
