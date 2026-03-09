import { useState, useRef, useCallback } from 'react';
// types
import { ITypeDocument } from 'src/types/type';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import { TableProps } from 'src/components/table';
//
import TypeDocumentShareDialog from './type-document-share-dialog';
import TypeDocumentNewFolderDialog from './type-document-new-folder-dialog';
import { Box, Button, Collapse, Divider } from '@mui/material';
import TypeDocumentPanel from './type-document-panel';
import TypeDocumentFileItem from './type-document-file-item';
import TypeDocumentActionSelected from './type-document-action-selected';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  data: ITypeDocument[];
  dataFiltered: ITypeDocument[];
  onEditItem: (id: string) => void;
  onOpenConfirm: VoidFunction;
  onDeleteItem: (id: string) => void;
};

export default function TypeDocumentGridView({
  table,
  data,
  dataFiltered,
  onEditItem,
  onDeleteItem,
  onOpenConfirm,
}: Props) {
  const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;

  const containerRef = useRef(null);

  const [folderName, setFolderName] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');

  const share = useBoolean();

  const newFolder = useBoolean();

  const upload = useBoolean();

  const files = useBoolean();

  const folders = useBoolean();

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleChangeFolderName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  }, []);

  return (
    <>
      <Box ref={containerRef}>
        <Collapse in={!files.value} unmountOnExit>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            gap={3}
          >
            {dataFiltered
              .filter((i) => i.code_document !== 'folder')
              .map((file) => (
                <TypeDocumentFileItem
                  key={file.id_type_document}
                  file={file}
                  selected={selected.includes(file.id_type_document)}
                  onSelect={() => onSelectItem(file.id_type_document)}
                  onEdit={() => onEditItem(file.id_type_document)}
                  onDelete={() => onDeleteItem(file.id_type_document)}
                  sx={{ maxWidth: 'auto' }}
                />
              ))}
          </Box>
        </Collapse>

        {!!selected?.length && (
          <TypeDocumentActionSelected
            numSelected={selected.length}
            rowCount={data.length}
            selected={selected}
            onSelectAllItems={(checked) =>
              onSelectAllItems(
                checked,
                data.map((row) => row.id_type_document)
              )
            }
            action={
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  onClick={onOpenConfirm}
                  sx={{ mr: 1 }}
                >
                  Delete
                </Button>

                <Button
                  color="primary"
                  size="small"
                  variant="contained"
                  startIcon={<Iconify icon="solar:share-bold" />}
                  onClick={share.onTrue}
                >
                  Share
                </Button>
              </>
            }
          />
        )}
      </Box>

      <TypeDocumentShareDialog
        open={share.value}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      <TypeDocumentNewFolderDialog open={upload.value} onClose={upload.onFalse} />

      <TypeDocumentNewFolderDialog
        open={newFolder.value}
        onClose={newFolder.onFalse}
        title="New Folder"
        onCreate={() => {
          newFolder.onFalse();
          setFolderName('');
          console.info('CREATE NEW FOLDER', folderName);
        }}
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
      />
    </>
  );
}
