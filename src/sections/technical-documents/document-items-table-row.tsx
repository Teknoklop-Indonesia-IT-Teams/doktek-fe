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
// utils
import { fCurrency } from 'src/utils/format-number';
// types
import { IDocument, IDocumentItem } from 'src/types/document';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import FileThumbnail from 'src/components/file-thumbnail';
import { useGetDivision } from 'src/api/division';
import { IDivision } from 'src/types/division';
import { ITypeDocument } from 'src/types/type';
import { Stack } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

type Props = {
  row: IDocumentItem;
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
  const {
    document_number,
    document_file,
    technicalDocument,
    typeDocument,
    created_at,
    updated_at,
  } = row;

  const typeObj = typeList.find((d) => d.id_type_document === typeDocument.id_type_document);
  const confirm = useBoolean();
  console.log('ROW', row);

  const popover = usePopover();
  const handleViewFile = (row: IDocumentItem) => {
    const file = document_file?.toString();

    if (!file) return;

    const fileUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

    window.open(fileUrl, '_blank');
  };

  const handleDownloadFile = (row: IDocumentItem) => {
    const file = document_file?.toString();

    if (!file) return;

    const fileUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = fileUrl;

    const fileName = typeof file === 'string' ? file.split('/').pop() : file;

    link.download = fileName || 'document';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <TableRow hover key={row.id_technical_document_item} selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell>
          <Typography variant="body2" noWrap>
            {document_number}
          </Typography>
        </TableCell>

        <TableCell>
          <Label variant="soft">{typeObj?.code_document}</Label>
        </TableCell>

        <TableCell>
          {document_file ? (
            <Stack direction="row" spacing={1}>
              <LoadingButton
                size="small"
                variant="outlined"
                startIcon={<Iconify icon="solar:eye-bold" />}
                onClick={() => handleViewFile(row)}
              >
                View
              </LoadingButton>

              <LoadingButton
                size="small"
                variant="contained"
                startIcon={<Iconify icon="solar:download-bold" />}
                onClick={() => handleDownloadFile(row)}
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

        <TableCell>{format(new Date(created_at), 'dd MMM yyyy')}</TableCell>

        <TableCell>{format(new Date(updated_at), 'dd MMM yyyy')}</TableCell>

        <TableCell align="right">
          <IconButton
            onClick={(e) => {
              popover.onOpen(e);
            }}
          >
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
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
