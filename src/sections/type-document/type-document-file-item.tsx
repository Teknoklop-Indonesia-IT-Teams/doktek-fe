import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { CardProps } from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
// utils
import { fDateTime } from 'src/utils/format-time';
import { fData } from 'src/utils/format-number';
// types
import { ITypeManager } from 'src/types/type';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useSnackbar } from 'src/components/snackbar';
import TextMaxLine from 'src/components/text-max-line';
import FileThumbnail from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import TypeDocumentShareDialog from './type-document-share-dialog';
import TypeDocumentFileDetails from './type-document-file-details';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  file: ITypeManager;
  selected?: boolean;
  onSelect?: VoidFunction;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
}

export default function TypeDocumentFileItem({
  file,
  selected,
  onSelect,
  onEdit,
  onDelete,
  sx,
  ...other
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  const checkbox = useBoolean();

  const share = useBoolean();

  const confirm = useBoolean();

  const details = useBoolean();
  const popover = usePopover();

  const renderIcon =
    (checkbox.value || selected) && onSelect ? (
      <Checkbox
        size="medium"
        checked={selected}
        onClick={onSelect}
        icon={<Iconify icon="eva:radio-button-off-fill" />}
        checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
        sx={{ p: 0.75 }}
      />
    ) : (
      <FileThumbnail file={file.code_document} sx={{ width: 36, height: 36 }} />
    );

  const renderText = (
    <>
      <TextMaxLine
        persistent
        variant="subtitle2"
        onClick={details.onTrue}
        sx={{ width: 1, mt: 2, mb: 0.5 }}
      >
        {file.type_document}
      </TextMaxLine>
    </>
  );

  return (
    <>
      <Stack
        component={Paper}
        variant="outlined"
        alignItems="flex-start"
        sx={{
          p: 2.5,
          borderRadius: 2,
          bgcolor: 'unset',
          cursor: 'pointer',
          position: 'relative',
          ...((checkbox.value || selected) && {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        <Box onMouseEnter={checkbox.onTrue} onMouseLeave={checkbox.onFalse}>
          {renderIcon}
        </Box>

        {renderText}
      </Stack>

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

      <TypeDocumentFileDetails
        item={file}
        open={details.value}
        onClose={details.onFalse}
        onEdit={() => {
          details.onFalse();
          onEdit();
        }}
        onDelete={() => {
          details.onFalse();
          onDelete();
        }}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
