import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Stack, { StackProps } from '@mui/material/Stack';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
// utils
import { fData } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
// types
import { ITypeDocument } from 'src/types/type';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import FileThumbnail from 'src/components/file-thumbnail';
import { Typography } from '@mui/material';
import { IDocument, IDocumentItem, IDocumentItemsLog } from 'src/types/document';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  file: IDocumentItemsLog;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
}

export default function FileDocumentItemRecent({ file, onEdit, onDelete, sx, ...other }: Props) {
  const { technicalDocumentItem, activity, created_at } = file;

  return (
    <>
      <Stack
        component={Paper}
        variant="outlined"
        spacing={2}
        direction="row"
        alignItems="center"
        sx={{
          borderRadius: 2,
          p: 2,
          ...sx,
        }}
      >
        {/* <FileThumbnail file={technicalDocumentItem?.document_file} sx={{ width: 36, height: 36 }} /> */}

        <Stack>
          <Typography variant="subtitle2">{technicalDocumentItem.document_number}</Typography>
          <Typography variant="subtitle2">{activity}</Typography>

          <Typography variant="body2" color="text.secondary">
            {created_at}
          </Typography>
        </Stack>
      </Stack>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="eva:link-2-fill" />
          Copy Link
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover> */}
    </>
  );
}
