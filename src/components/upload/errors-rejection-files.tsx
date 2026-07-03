import { FileRejection } from 'react-dropzone';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// utils
import { fData } from 'src/utils/format-number';
//
import { fileData } from '../file-thumbnail';

// ----------------------------------------------------------------------

type Props = {
  fileRejections: FileRejection[];
};

export default function RejectionFiles({ fileRejections }: Props) {
  if (!fileRejections.length) {
    return null;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        textAlign: 'left',
        borderStyle: 'dashed',
        borderColor: 'error.main',
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = fileData(file);

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size ? fData(size) : ''}
            </Typography>

            {errors.map((error) => {
              let message = error.message;

              if (error.code === 'file-too-large') {
                message = 'apabila file terlalu besar harap compress terlebih dahulu agar menjadi lebih kecil';
              } else if (error.code === 'file-invalid-type') {
                message = 'Tipe file tidak didukung';
              }

              return (
                <Box key={error.code} component="span" sx={{ typography: 'caption' }}>
                  - {message}
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Paper>
  );
}
