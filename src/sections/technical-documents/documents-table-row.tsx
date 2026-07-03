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
    document_file_pdf,
    document_file,
    created_by,
  } = row;
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const view = useBoolean();
  const divisionObj = divisionList.find((d) => d.id_division === division.id_division);
  const confirm = useBoolean();

  const popover = usePopover();

  const pdf = {
    main: '#f44336',
    soft: 'rgba(244, 67, 54, 0.16)',
  };

  const docx = {
    main: '#2196f3',
    soft: 'rgba(33, 150, 243, 0.16)',
  };

  const getFileExtension = (file?: string) => {
    if (!file) return '-';

    const ext = file.split('.').pop()?.toLowerCase();

    return ext || '-';
  };

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
              (divisionObj?.division_name === 'IT Engineer' && 'info') ||
              (divisionObj?.division_name === 'Finance' && 'secondary') ||
              'default'
            }
          >
            {divisionObj?.division_name}
          </Label>
        </TableCell>

        {/* View PDF */}
        <TableCell>
          {document_file_pdf ? (
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
              {getFileLabel(document_file_pdf)}
            </LoadingButton>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No File PDF
            </Typography>
          )}
        </TableCell> 

        <TableCell>
          {document_file ? (
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
              {getFileLabel(document_file)}
            </LoadingButton>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No File Word
            </Typography>
          )}
        </TableCell>

        <TableCell align="left" sx={{ px: 1 }}>
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
          Detail
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
