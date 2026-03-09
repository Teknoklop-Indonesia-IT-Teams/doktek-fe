// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _invoices } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import DocumentDetails from '../documents-details';
import { useGetDocumentByID } from 'src/api/document';
import Button from '@mui/material/Button';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import DocumentDetailsToolbar from '../documents-details-toolbar';
import { useRouter } from 'src/routes/hooks';
import { useState } from 'react';
import { Box, Dialog, Typography } from '@mui/material';
import DocumentItemsNewEditForm from '../document-items-new-edit-form';
import { IDocumentItem } from 'src/types/document';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function DocumentsDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const { document: currentDocument } = useGetDocumentByID(id);
  const currentDocuments = _invoices.filter((documents) => documents.id === id)[0];
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IDocumentItem | null>(null);

  const handleEditItem = (item: IDocumentItem) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleCreateItem = () => {
    setSelectedItem(null);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <DocumentDetailsToolbar backLink={paths.dashboard.technicalDocument.root} />
        <CustomBreadcrumbs
          heading={currentDocument?.document_number}
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Documents',
              href: paths.dashboard.technicalDocument.root,
            },
            { name: currentDocument?.document_number },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleCreateItem}
            >
              New Document Item
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <DocumentDetails documents={currentDocument} onEditItem={handleEditItem} />
      </Container>
      <Dialog open={openModal} onClose={handleClose} maxWidth="md" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {selectedItem ? 'Edit Document Item' : 'New Document Item'}
          </Typography>

          <DocumentItemsNewEditForm
            id_technical_documents={id}
            currentDocumentItems={selectedItem || undefined}
          />
        </Box>
      </Dialog>
      ;
    </>
  );
}
