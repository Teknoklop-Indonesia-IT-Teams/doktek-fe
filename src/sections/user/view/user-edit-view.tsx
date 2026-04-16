import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetUserById } from 'src/api/user';
import UserNewEditForm from '../user-new-edit-form';

type Props = {
  id: string;
};

export default function UserEditView({ id }: Props) {
  const settings = useSettingsContext();
  const { user, userLoading } = useGetUserById(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.list },
          { name: user?.[0]?.username },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {!userLoading && <UserNewEditForm currentUser={user} />}
    </Container>
  );
}
