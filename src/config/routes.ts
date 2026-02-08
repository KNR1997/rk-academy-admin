export const Routes = {
  dashboard: '/',
  login: '/login',
  logout: '/logout',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  adminMyShops: '/my-shops',
  myCourses: {
    ...routesFactory('/my-courses'),
  },
  profile: '/profile',
  settings: '/settings',
  paymentSettings: '/settings/payment',
  seoSettings: '/settings/seo',
  eventSettings: '/settings/events',
  shopSettings: '/settings/shop',
  companyInformation: '/settings/company-information',
  maintenance: '/settings/maintenance',
  promotionPopup: '/settings/promotion-popup',
  storeSettings: '/vendor/settings',
  storeKeepers: '/vendor/store_keepers',
  profileUpdate: '/profile-update',
  checkout: '/orders/checkout',
  verifyEmail: '/verify-email',
  verifyLicense: '/verify-license',
  user: {
    ...routesFactory('/users'),
  },
  teacher: {
    ...routesFactory('/teachers'),
  },
  student: {
    ...routesFactory('/students'),
  },
  reviews: {
    ...routesFactory('/reviews'),
  },
  abuseReviews: {
    ...routesFactory('/abusive_reports'),
  },
  abuseReviewsReport: {
    ...routesFactory('/abusive_reports/reject'),
  },
  subject: {
    ...routesFactory('/subjects'),
  },
  course: {
    ...routesFactory('/courses'),
  },
  courseOffering: {
    ...routesFactory('/course-offerings'),
  },
  gradeLevel: {
    ...routesFactory('/grade-levels'),
  },
  enrollment: {
    ...routesFactory('/enrollments'),
  },
  enrollmentPayment: {
    ...routesFactory('/enrollment-payments'),
  },
  staff: {
    ...routesFactory('/staffs'),
  },
  question: {
    ...routesFactory('/questions'),
  },
  message: {
    ...routesFactory('/message'),
  },
  conversations: {
    ...routesFactory('/message/conversations'),
  },
  storeNotice: {
    ...routesFactory('/store-notices'),
  },
  storeNoticeRead: {
    ...routesFactory('/store-notices/read'),
  },
  notifyLogs: {
    ...routesFactory('/notify-logs'),
  },
  myCourseOfferings: {
    ...routesFactory('/my/course-offerings'),
  },
  adminList: '/users/admins',
  vendorList: '/users/vendors',
  pendingVendorList: '/users/vendors/pending',
  customerList: '/users/customer',
  myStaffs: '/users/my-staffs',
  vendorStaffs: '/users/vendor-staffs',
  ownerDashboardNotice: '/notice',
  ownerDashboardNotifyLogs: '/notify-logs',
  reports: {
    incomeReport: '/reports/income-report',
    pendingPayments: '/reports/pending-payments',
  },
};

function routesFactory(endpoint: string) {
  return {
    list: `${endpoint}`,
    create: `${endpoint}/create`,
    editWithoutLang: (slug: string, shop?: string) => {
      return shop
        ? `/${shop}${endpoint}/${slug}/edit`
        : `${endpoint}/${slug}/edit`;
    },
    edit: (slug: string, language: string, shop?: string) => {
      return shop
        ? `/${language}/${shop}${endpoint}/${slug}/edit`
        : `${language}${endpoint}/${slug}/edit`;
    },
    translate: (slug: string, language: string, shop?: string) => {
      return shop
        ? `/${language}/${shop}${endpoint}/${slug}/translate`
        : `${language}${endpoint}/${slug}/translate`;
    },
    details: (slug: string) => `${endpoint}/${slug}`,
    editByIdWithoutLang: (id: string, shop?: string) => {
      return shop ? `/${shop}${endpoint}/${id}/edit` : `${endpoint}/${id}/edit`;
    },
  };
}
