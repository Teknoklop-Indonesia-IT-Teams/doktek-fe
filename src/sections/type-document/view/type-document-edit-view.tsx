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
import TypeDocumentsNewEditForm from '../type-document-new-edit-form';
import { useGetProduct } from 'src/api/product';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function TypeDocumentsEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { product: currentProduct } = useGetProduct(id);
  const currentTypeDocuments = _invoices.find((invoice) => invoice.id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Type Documents',
            href: paths.dashboard.typeDocument.root,
          },
          { name: currentProduct?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TypeDocumentsNewEditForm currentProduct={currentProduct} />
    </Container>
  );
}
