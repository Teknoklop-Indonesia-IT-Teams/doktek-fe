import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useAuthContext } from 'src/auth/hooks';
import { useGetProfiles } from 'src/api/profile';
import { useGetUsers } from 'src/api/user';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  inbox: icon('ic_inbox'),
  users: icon('ic_users'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  document: icon('ic_document'),
  documents: icon('ic_documents'),
  buildings: icon('ic_buildings'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();
  const { user } = useAuthContext();
  const { users } = useGetUsers();

  const isSuperAdmin = user?.role === 'Super Admin';
  const isAdmin = user?.role === 'Admin';

  const data = useMemo(() => {
    if (!users || !user) return [];

    return [
      {
        subheader: t('overview'),
        items: [
          {
            title: t('app'),
            path: paths.dashboard.general.file,
            icon: ICONS.file,
          },
        ],
      },
      {
        subheader: t('technical document'),
        items: [
          {
            title: t('documents'),
            path: paths.dashboard.technicalDocument.root,
            icon: ICONS.documents,
          },
          {
            title: t('type document'),
            path: paths.dashboard.typeDocument.root,
            icon: ICONS.folder,
          },
        ],
      },

      // ✅ FIX DI SINI
      ...(isSuperAdmin || isAdmin
        ? [
            {
              subheader: t('master data'),
              items: [
                {
                  title: t('user'),
                  path: paths.dashboard.user.list,
                  icon: ICONS.user,
                },

                ...(isSuperAdmin
                  ? [
                      {
                        title: t('division'),
                        path: paths.dashboard.division.root,
                        icon: ICONS.buildings,
                      },
                      {
                        title: t('roles'),
                        path: paths.dashboard.roles.root,
                        icon: ICONS.users,
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
    ];
  }, [t, isSuperAdmin, isAdmin, user, users]);

  return data;
}
