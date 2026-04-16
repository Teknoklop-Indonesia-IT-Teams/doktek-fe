// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _types } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import TypeDocumentsNewEditForm from '../type-document-new-edit-form';
import { useGetType, useGetTypeDetails } from 'src/api/type';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function TypeDocumentsEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { type: currentType } = useGetTypeDetails(id);
  // const currentTypeDocuments = _types.find((type) => type.id === id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
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
          { name: currentType?.type_document },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TypeDocumentsNewEditForm currentTypes={currentType} />
    </Container>
  );
}
