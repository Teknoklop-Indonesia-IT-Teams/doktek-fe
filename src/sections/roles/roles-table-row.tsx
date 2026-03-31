// @mui
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { IRole } from 'src/types/role';

// ----------------------------------------------------------------------

type Props = {
  row: IRole;
  index: number;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function RolesTableRow({ row, index, onViewRow, onEditRow, onDeleteRow }: Props) {
  const { role_name } = row;

  const confirm = useBoolean();

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {index + 1}
              </Typography>
            }
          />
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (role_name === 'paid' && 'success') ||
              (role_name === 'pending' && 'warning') ||
              (role_name === 'overdue' && 'error') ||
              'default'
            }
          >
            {role_name}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color="error" onClick={confirm.onTrue}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

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
    </>
  );
}
