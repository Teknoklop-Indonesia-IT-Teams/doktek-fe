import { format } from 'date-fns';
// @mui
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IDocumentActivity } from 'src/types/document';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { IDivision } from 'src/types/division';
import { Box, Dialog, DialogActions, Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { enqueueSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

type Props = {
  row: IDocumentActivity;
  divisionList: IDivision[];
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function DocumentsTableRow({
  row,
  divisionList,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  const {
    title,
    document_number,
    division,
    typeDocument,
    created_at,
    updated_at,
    document_file,
    created_by,
  } = row;
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  console.log('keretakreta', created_by);

  const view = useBoolean();
  const divisionObj = divisionList.find((d) => d.id_division === division.id_division);
  const confirm = useBoolean();

  const popover = usePopover();

  const getFileExtension = (file?: string) => {
    if (!file) return '';
    return file.split('.').pop()?.toLowerCase();
  };

  const isPDF = (file?: string) => getFileExtension(file) === 'pdf';

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

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {document_number}
              </Typography>
            }
          />
        </TableCell>
        <TableCell>
          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {title}
              </Typography>
            }
          />
        </TableCell>
        <TableCell>
          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {typeDocument.code_document}
              </Typography>
            }
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(updated_at), 'dd MMM yyyy')}
            secondary={format(new Date(updated_at), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(created_at), 'dd MMM yyyy')}
            secondary={format(new Date(created_at), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (divisionObj?.division_name === 'Laboratory' && 'success') ||
              (divisionObj?.division_name === 'Automation' && 'warning') ||
              (divisionObj?.division_name === 'RnD' && 'error') ||
              (divisionObj?.division_name === 'IT Enggineer' && 'info') ||
              (divisionObj?.division_name === 'Finance' && 'secondary') ||
              'default'
            }
          >
            {divisionObj?.division_name}
          </Label>
        </TableCell>

        <TableCell>
          {document_file ? (
            <Stack direction="row" spacing={1}>
              {isPDF(document_file) ? (
                <LoadingButton
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon="solar:eye-bold" />}
                  onClick={handleViewFile}
                >
                  View
                </LoadingButton>
              ) : (
                <LoadingButton
                  size="small"
                  variant="contained"
                  startIcon={<Iconify icon="solar:download-bold" />}
                  onClick={handleDownloadFile}
                >
                  Download
                </LoadingButton>
              )}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No File
            </Typography>
          )}
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

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
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
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
