import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// ROLES
const RolesListPage = lazy(() => import('src/pages/dashboard/roles/list'));
const RolesDetailsPage = lazy(() => import('src/pages/dashboard/roles/details'));
const RolesCreatePage = lazy(() => import('src/pages/dashboard/roles/new'));
const RolesEditPage = lazy(() => import('src/pages/dashboard/roles/edit'));
// DOCUMENTS
const DocumentsListPage = lazy(() => import('src/pages/dashboard/technical-documents/list'));
const DocumentsDetailsPage = lazy(() => import('src/pages/dashboard/technical-documents/details'));
const DocumentsCreatePage = lazy(() => import('src/pages/dashboard/technical-documents/new'));
const DocumentsEditPage = lazy(() => import('src/pages/dashboard/technical-documents/edit'));
// ACTIVITY
const ActivityLogsListPage = lazy(() => import('src/pages/dashboard/activity-logs/list'));
const ActivityLogsDetailsPage = lazy(() => import('src/pages/dashboard/activity-logs/details'));
// DIVISION
const DivisionListPage = lazy(() => import('src/pages/dashboard/division/list'));
const DivisionDetailsPage = lazy(() => import('src/pages/dashboard/division/details'));
const DivisionCreatePage = lazy(() => import('src/pages/dashboard/division/new'));
const DivisionEditPage = lazy(() => import('src/pages/dashboard/division/edit'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// JOB
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TYPE DOCUMENT
import TypeDocumentListPage from 'src/pages/dashboard/type-document/list';
import TypeDocumentEditPage from 'src/pages/dashboard/type-document/edit';
import TypeDocumentsCreatePage from 'src/pages/dashboard/type-document/new';
import DocumentItemsCreatePage from 'src/pages/dashboard/technical-document-items/new';
import DocumentItemsEditPage from 'src/pages/dashboard/technical-document-items/edit';
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'technical-document',
        children: [
          { element: <DocumentsListPage />, index: true },
          { path: 'list', element: <DocumentsListPage /> },
          { path: ':id', element: <DocumentsDetailsPage /> },
          { path: 'new', element: <DocumentsCreatePage /> },
          { path: ':id/edit', element: <DocumentsEditPage /> },
        ],
      },
      {
        path: 'technical-document-items',
        children: [
          { path: ':id', element: <DocumentsDetailsPage /> },
          { path: 'new', element: <DocumentItemsCreatePage /> },
          { path: ':id/edit', element: <DocumentItemsEditPage /> },
        ],
      },
      {
        path: 'activity',
        children: [
          { element: <ActivityLogsListPage />, index: true },
          { path: 'list', element: <ActivityLogsListPage /> },
          { path: ':id', element: <ActivityLogsDetailsPage /> },
        ],
      },
      {
        path: 'division',
        children: [
          { element: <DivisionListPage />, index: true },
          { path: 'list', element: <DivisionListPage /> },
          { path: ':id', element: <DivisionDetailsPage /> },
          { path: 'new', element: <DivisionCreatePage /> },
          { path: ':id/edit', element: <DivisionEditPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'roles',
        children: [
          { element: <RolesListPage />, index: true },
          { path: 'list', element: <RolesListPage /> },
          { path: ':id', element: <RolesDetailsPage /> },
          { path: ':id/edit', element: <RolesEditPage /> },
          { path: 'new', element: <RolesCreatePage /> },
        ],
      },
      {
        path: 'type-document',
        children: [
          { element: <TypeDocumentListPage />, index: true },
          { path: 'list', element: <TypeDocumentListPage /> },
          { path: ':id/edit', element: <TypeDocumentEditPage /> },
          { path: 'new', element: <TypeDocumentsCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
