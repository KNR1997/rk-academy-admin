import {
  adminAndOwnerOnly,
  adminAndStudentOnly,
  adminOnly,
  adminOwnerAndStaffOnly,
  ownerAndStaffOnly,
  studentOnly,
} from '@/utils/auth-utils';
import { Routes } from '@/config/routes';

export const siteSettings = {
  name: 'PickBazar',
  description: '',
  logo: {
    url: '/logo.svg',
    alt: 'PickBazar',
    href: '/',
    width: 138,
    height: 34,
  },
  collapseLogo: {
    url: '/collapse-logo.svg',
    alt: 'P',
    href: '/',
    width: 32,
    height: 32,
  },
  defaultLanguage: 'en',
  author: {
    name: 'RedQ',
    websiteUrl: 'https://redq.io',
    address: '',
  },
  headerLinks: [],
  authorizedLinks: [
    {
      href: Routes.profileUpdate,
      labelTransKey: 'authorized-nav-item-profile',
      icon: 'UserIcon',
      permission: adminAndStudentOnly,
    },
    {
      href: Routes.logout,
      labelTransKey: 'authorized-nav-item-logout',
      icon: 'LogOutIcon',
      permission: adminAndStudentOnly,
    },
  ],
  currencyCode: 'USD',
  sidebarLinks: {
    admin: {
      root: {
        href: Routes.dashboard,
        label: 'Main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: Routes.dashboard,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
          },
        ],
      },

      content: {
        href: '',
        label: 'text-content-management',
        icon: 'ShopIcon',
        childMenu: [
          {
            href: '',
            label: 'sidebar-nav-item-subjects',
            icon: 'ProductsIcon',
            childMenu: [
              {
                href: Routes.subject.list,
                label: 'text-all-subjects',
                icon: 'ProductsIcon',
              },
              {
                href: Routes.subject.create,
                label: 'text-add-all-subjects',
                icon: 'ProductsIcon',
              },
            ],
          },
          {
            href: '',
            label: 'sidebar-nav-item-courses',
            icon: 'InventoryIcon',
            childMenu: [
              {
                href: Routes.course.list,
                label: 'text-all-courses',
                icon: 'InventoryIcon',
              },
              {
                href: Routes.course.create,
                label: 'text-add-all-courses',
                icon: 'InventoryIcon',
              },
            ],
          },
          {
            href: '',
            label: 'sidebar-nav-item-course-offerings',
            icon: 'OrdersIcon',
            childMenu: [
              {
                href: Routes.courseOffering.list,
                label: 'text-all-course-offerings',
                icon: 'OrdersIcon',
              },
              {
                href: Routes.courseOffering.create,
                label: 'text-add-all-course-offerings',
                icon: 'OrdersIcon',
              },
            ],
          },
          {
            href: '',
            label: 'sidebar-nav-item-grade-levels',
            icon: 'InformationIcon',
            childMenu: [
              {
                href: Routes.gradeLevel.list,
                label: 'text-all-grade-levels',
                icon: 'InformationIcon',
              },
              {
                href: Routes.gradeLevel.create,
                label: 'text-add-all-grade-levels',
                icon: 'InformationIcon',
              },
            ],
          },
          {
            href: '',
            label: 'sidebar-nav-item-enrollments',
            icon: 'TagIcon',
            childMenu: [
              {
                href: Routes.enrollment.list,
                label: 'text-all-enrollments',
                icon: 'TagIcon',
              },
              {
                href: Routes.enrollment.create,
                label: 'text-add-all-enrollments',
                icon: 'TagIcon',
              },
            ],
          },
          {
            href: '',
            label: 'sidebar-nav-item-enrollment-payments',
            icon: 'TaxesIcon',
            childMenu: [
              {
                href: Routes.enrollmentPayment.list,
                label: 'text-all-payments',
                icon: 'TaxesIcon',
              },
              {
                href: Routes.enrollmentPayment.create,
                label: 'text-add-payments',
                icon: 'TaxesIcon',
              },
            ],
          },
        ],
      },

      user: {
        href: '',
        label: 'text-user-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: Routes.user.list,
            label: 'text-all-users',
            icon: 'UsersIcon',
          },
          {
            href: Routes.adminList,
            label: 'text-admin-list',
            icon: 'AdminListIcon',
          },
          {
            href: Routes.teacher.list,
            label: 'text-teacher-list',
            icon: 'StaffIcon',
          },
          {
            href: Routes.student.list,
            label: 'text-student-list',
            icon: 'CustomersIcon',
          },
        ],
      },

      report: {
        href: '',
        label: 'text-reports',
        icon: 'ReportIcon',
        childMenu: [
          {
            href: Routes.reports.incomeReport,
            label: 'text-income-report',
            icon: 'ReportIcon',
          },
                    {
            href: Routes.reports.pendingPayments,
            label: 'text-pending-payments',
            icon: 'ShiftPendingIcon',
          },
        ],
      },
    },

    teacher: {
      root: {
        href: Routes.dashboard,
        label: 'Main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: Routes.dashboard,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
          },
        ],
      },

      content: {
        href: '',
        label: 'text-content-management',
        icon: 'ShopIcon',
        childMenu: [
          {
            href: Routes.myCourseOfferings.list,
            label: 'sidebar-nav-item-course-offerings',
            icon: 'ProductsIcon',
          },
        ],
      },
    },

    student: [
      {
        href: Routes.dashboard,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
        permissions: studentOnly,
      },
      {
        href: Routes.myCourses.list,
        label: 'sidebar-nav-item-my-courses',
        icon: 'DiaryIcon',
        permissions: studentOnly,
      },
    ],

    shop: {
      root: {
        href: '',
        label: 'text-main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: (shop: string) => `${Routes.dashboard}${shop}`,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },

      feedback: {
        href: '',
        label: 'text-feedback-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.reviews.list}`,
            label: 'sidebar-nav-item-reviews',
            icon: 'ReviewIcon',
            permissions: adminAndOwnerOnly,
          },
          {
            href: (shop: string) => `/${shop}${Routes.question.list}`,
            label: 'sidebar-nav-item-questions',
            icon: 'QuestionIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },

      user: {
        href: '',
        label: 'text-user-control',
        icon: 'SettingsIcon',
        childMenu: [
          {
            href: (shop: string) => `/${shop}${Routes.staff.list}`,
            label: 'sidebar-nav-item-staffs',
            icon: 'UsersIcon',
            permissions: adminAndOwnerOnly,
          },
        ],
      },
    },

    staff: {
      root: {
        href: '',
        label: 'text-main',
        icon: 'DashboardIcon',
        childMenu: [
          {
            href: (shop: string) => `${Routes.dashboard}${shop}`,
            label: 'sidebar-nav-item-dashboard',
            icon: 'DashboardIcon',
            permissions: adminOwnerAndStaffOnly,
          },
        ],
      },
    },

    ownerDashboard: [
      {
        href: Routes.dashboard,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
        permissions: ownerAndStaffOnly,
      },
    ],
  },
  product: {
    placeholder: '/product-placeholder.svg',
  },
  avatar: {
    placeholder: '/avatar-placeholder.svg',
  },
};

export const socialIcon = [
  {
    value: 'FacebookIcon',
    label: 'Facebook',
  },
  {
    value: 'InstagramIcon',
    label: 'Instagram',
  },
  {
    value: 'TwitterIcon',
    label: 'Twitter',
  },
  {
    value: 'YouTubeIcon',
    label: 'Youtube',
  },
];
