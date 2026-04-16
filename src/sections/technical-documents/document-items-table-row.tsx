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
import Label from 'src/components/label';

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
  const { document_number, document_file, created_at, created_by } = row;
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const confirm = useBoolean();
  const view = useBoolean();
  console.log('rowsss2', row);

  console.log('CREACREA', created_by);

  const popover = usePopover();

  const isPDF = (file: string) => {
    return file.toLowerCase().endsWith('.pdf');
  };

  const handleViewFile = () => {
    if (!document_file) return;

    const url = `${import.meta.env.VITE_API_BE}${document_file}`;

    if (isPDF(document_file)) {
      setFileUrl(url);
      view.onTrue();
    } else {
      handleDownloadFile();

      enqueueSnackbar('File tidak bisa dipreview, langsung didownload', {
        variant: 'warning',
      });
    }
  };

  const handleDownloadFile = () => {
    if (!document_file) return;

    const url = `${import.meta.env.VITE_API_BE}${document_file}`;

    const link = document.createElement('a');
    link.href = url;

    const fileName = document_file.split('/').pop();

    link.download = fileName || 'document';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileExtension = (file?: string) => {
    if (!file) return '-';

    const ext = file.split('.').pop()?.toLowerCase();

    return ext || '-';
  };

  const getFileLabel = (file?: string) => {
    const ext = getFileExtension(file);

    if (ext === '-') return '-';

    return ext.toUpperCase(); // pdf → PDF
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
          {document_file ? (
            <Stack direction="row" spacing={1}>
              <LoadingButton
                size="small"
                variant="outlined"
                startIcon={<Iconify icon="solar:eye-bold" />}
                onClick={handleViewFile}
                // onClick={() => view.onTrue()}
                sx={{ display: 'flex', gap: 1 }}
              >
                View
              </LoadingButton>

              <LoadingButton
                size="small"
                variant="contained"
                startIcon={<Iconify icon="solar:download-bold" />}
                onClick={() => handleDownloadFile()}
              >
                Download
              </LoadingButton>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No File
            </Typography>
          )}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color="default"
            sx={{
              ...(getFileExtension(document_file) === 'docx' && {
                bgcolor: 'rgba(33, 150, 243, 0.16)',
                color: '#2196f3',
              }),
              ...(getFileExtension(document_file) === 'doc' && {
                bgcolor: 'rgba(33, 150, 243, 0.16)',
                color: '#2196f3',
              }),
              ...(getFileExtension(document_file) === 'pdf' && {
                bgcolor: 'rgba(244, 67, 54, 0.16)',
                color: '#f44336',
              }),
              ...(getFileExtension(document_file) === 'xlsx' && {
                bgcolor: 'rgba(76, 175, 80, 0.16)',
                color: '#4caf50',
              }),
            }}
          >
            {getFileLabel(document_file)}
          </Label>
        </TableCell>

        <TableCell>{format(new Date(created_at), 'dd MMM yyyy')}</TableCell>
        <TableCell>
          <Typography variant="body2" noWrap>
            {created_by}
          </Typography>
        </TableCell>
        {/* <TableCell>{format(new Date(updated_at), 'dd MMM yyyy')}</TableCell> */}

        {/* <TableCell align="right">
          <IconButton
            onClick={(e) => {
              popover.onOpen(e);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
        {/* <TableCell align="right">
          <IconButton
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        {/* <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem> */}

        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

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
