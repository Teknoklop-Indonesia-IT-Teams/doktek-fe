import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { IUserItemDoktek } from 'src/types/user';

// ----------------------------------------------------------------------

type Props = {
  row: IUserItemDoktek;
  index: number;
  onEditRow: VoidFunction;
};

export default function UserTableRow({ row, index, onEditRow }: Props) {
  const { username, division, role, flag_active } = row;

  return (
    <TableRow hover>
      <TableCell>{index}</TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={username} sx={{ mr: 2 }}>
          {username?.charAt(0).toUpperCase()}
        </Avatar>
        <ListItemText primary={username} primaryTypographyProps={{ typography: 'body2' }} />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{division?.division_name}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{role?.role_name}</TableCell>

      <TableCell>
        <Label variant="soft" color={flag_active ? 'success' : 'error'}>
          {flag_active ? 'Active' : 'Inactive'}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="Edit" placement="top" arrow>
          <IconButton onClick={onEditRow} sx={{ mr: 1 }}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
