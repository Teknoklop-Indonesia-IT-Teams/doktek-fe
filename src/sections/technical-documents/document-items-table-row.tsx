import { format } from 'date-fns';
// @mui
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IDocumentActivity } from 'src/types/document';
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ITypeDocument } from 'src/types/type';
import { Box, Dialog, DialogActions, Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { enqueueSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

type Props = {
  row: IDocumentActivity;
  index: number;
  typeList: ITypeDocument[];
  selected: boolean;
  onSelectRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};
export default function DocumentItemsTableRow({
  row,
  index,
  typeList,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  const { document_number, document_file, document_file_pdf, created_at, created_by } = row;
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const confirm = useBoolean();
  const view = useBoolean();

  const popover = usePopover();

  const pdf = { main: '#f44336', soft: 'rgba(244, 67, 54, 0.16)' };
  const docx = { main: '#2196f3', soft: 'rgba(33, 150, 243, 0.16)' };

  const getFileLabel = (file?: string | null) => {
    if (!file) return '-';
    const ext = file.split('.').pop()?.toLowerCase();
    return ext ? ext.toUpperCase() : '-';
  };

  const handleViewPdf = () => {
    if (!document_file_pdf) return;
    const url = `${import.meta.env.VITE_API_BE}${document_file_pdf}`;
    setFileUrl(url);
    view.onTrue();
  };

  const handleDownloadWord = () => {
    if (!document_file) return;
    const url = `${import.meta.env.VITE_API_BE}${document_file}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = document_file.split('/').pop() || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <TableRow hover key={row.id_technical_document_activity} selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell>
          <Typography variant="body2" noWrap>
            {document_number}
          </Typography>
        </TableCell>

        <TableCell>
          <Stack direction="row" spacing={1.5}>
            {/* View PDF */}
            {document_file_pdf ? (
              <Stack alignItems="center" spacing={0.5}>
                <LoadingButton
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon="solar:eye-bold" />}
                  onClick={handleViewPdf}
                  sx={{
                    color: pdf.main,
                    borderColor: pdf.main,
                    bgcolor: pdf.soft,
                    '&:hover': {
                      borderColor: pdf.soft,
                      bgcolor: pdf.main,
                      color: '#fff',
                    },
                  }}
                >
                  View
                </LoadingButton>
                <Typography variant="caption" sx={{ color: pdf.main, fontWeight: 600 }}>
                  {getFileLabel(document_file_pdf)}
                </Typography>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No File PDF
              </Typography>
            )}

            {/* Download Word */}
            {document_file ? (
              <Stack alignItems="center" spacing={0.5}>
                <LoadingButton
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon="solar:download-bold" />}
                  onClick={handleDownloadWord}
                  sx={{
                    color: docx.main,
                    borderColor: docx.main,
                    bgcolor: docx.soft,
                    '&:hover': {
                      borderColor: docx.soft,
                      bgcolor: docx.main,
                      color: '#fff',
                    },
                  }}
                >
                  Download
                </LoadingButton>
                <Typography variant="caption" sx={{ color: docx.main, fontWeight: 600 }}>
                  {getFileLabel(document_file)}
                </Typography>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No File Word
              </Typography>
            )}
          </Stack>
        </TableCell>

        <TableCell>{format(new Date(created_at), 'dd MMM yyyy')}</TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions sx={{ p: 1.5 }}>
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1 }}>
            {fileUrl && (
              <iframe src={fileUrl} width="100%" height="100%" style={{ border: 'none' }} />
            )}
          </Box>
        </Box>
      </Dialog>
    </>
  );
}