import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
// utils
import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
// types
import { ITypeDocument } from 'src/types/type';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import FileThumbnail, { fileFormat } from 'src/components/file-thumbnail';
//
import TypeDocumentShareDialog from './type-document-share-dialog';
import TypeDocumentInvitedItem from './type-document-invited-item';

// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: ITypeDocument;
  onEdit: VoidFunction;
  onClose: VoidFunction;
  onDelete: VoidFunction;
};

export default function TypeDocumentFileDetails({
  item,
  open,
  onEdit,
  onClose,
  onDelete,
  ...other
}: Props) {
  const { type_document, code_document } = item;

  const properties = useBoolean(true);

  const renderProperties = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Properties
        <IconButton size="small" onClick={properties.onToggle}>
          <Iconify
            icon={properties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {properties.value && (
        <>
          <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
            <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
              Code Document
            </Box>
            {fileFormat(code_document)}
          </Stack>
        </>
      )}
    </Stack>
  );

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 320 },
        }}
        {...other}
      >
        <Scrollbar sx={{ height: 1 }}>
          <Stack
            spacing={2.5}
            justifyContent="center"
            sx={{
              p: 2.5,
              bgcolor: 'background.neutral',
            }}
          >
            <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
              {type_document}
            </Typography>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderProperties}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <Button
            fullWidth
            variant="soft"
            color="success"
            size="large"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={onEdit}
          >
            Edit
          </Button>
        </Box>

        <Box sx={{ p: 2.5 }}>
          <Button
            fullWidth
            variant="soft"
            color="error"
            size="large"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={onDelete}
          >
            Delete
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
