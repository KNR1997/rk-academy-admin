import { toInteger } from 'lodash';
import type { NextPage } from 'next';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  authorization?: boolean;
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export enum GradeType {
  GRADE_6 = 'GRADE_6',
  GRADE_7 = 'GRADE_7',
  GRADE_8 = 'GRADE_8',
  GRADE_9 = 'GRADE_9',
  GRADE_10 = 'GRADE_10',
  GRADE_11 = 'GRADE_11',
}

export enum CourseType {
  ONLINE = 'ONLINE',
  PHYSICAL = 'PHYSICAL',
}

export enum StoreNoticePriorityType {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}
export enum StoreNoticeType {
  all_vendor = 'all_vendor',
  specific_vendor = 'specific_vendor',
  all_shop = 'all_shop',
  specific_shop = 'specific_shop',
}

export enum EnrollmentStatusType {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
}

export type QueryOptionsType = {
  page?: number;
  name?: string;
  shop_id?: number;
  limit?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
};

export enum FlashSaleType {
  PERCENTAGE = 'percentage',
  FIXED_RATE = 'fixed_rate',
  DEFAULT = 'percentage',
  // WALLET_POINT_GIFT = 'wallet_point_gift',
  // FREE_SHIPPING = 'free_shipping',
}

export interface TodayTotalOrderByStatus {
  pending: number;
  processing: number;
  complete: number;
  cancelled: number;
  refunded: number;
  failed: number;
  localFacility: number;
  outForDelivery: number;
}

export enum PaymentStatus {
  PENDING = 'payment-pending',
  PROCESSING = 'payment-processing',
  SUCCESS = 'payment-success',
  FAILED = 'payment-failed',
  REVERSAL = 'payment-reversal',
  COD = 'payment-cash-on-delivery',
}

export interface NameAndValueType {
  name: string;
  value: string;
}
export enum Permission {
  SuperAdmin = 'super_admin',
  StoreOwner = 'store_owner',
  Staff = 'staff',
  Customer = 'customer',
}

export interface GetParams {
  slug: string;
  language?: string;
}

export interface QueryOptions {
  language: string;
  limit?: number;
  page?: number;
  ordering?: string;
  sortedBy?: SortOrder;
}

export interface ShopSocialInput {
  icon?: string;
  url?: string;
}

export interface PaginatorInfo<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokens: { access: string; refresh: string };
  permissions: string[];
  role: string;
}

export interface CreateTypeInput {
  name: string;
  slug?: string;
  language?: string;
  gallery?: AttachmentInput[];
  icon?: string;
  banner_text?: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  code: string;
}

export interface Course {
  id: string;
  name: string;
  slug: string;
  fee: number;
}

export interface CourseOffering {
  id: string;
  course: Course;
  teacher: Teacher;
  batch: number;
  fee: number;
  year: number;
  grade_level: GradeLevel;
}

export interface MonthData {
  paid: boolean;
  amount?: number;
  attended?: boolean;
}

export interface Enrollment {
  id: string;
  student: Student;
  course_offering: CourseOffering;
  status: EnrollmentStatusType;
  last_payment_month: number;
  last_payment_year: number;
}

export interface EnrollmentWithMonth {
  id: string;
  student: Student;
  course_offering: CourseOffering;
  status: EnrollmentStatusType;
  last_payment_month: number;
  last_payment_year: number;
  months: {
    jan?: MonthData;
    feb?: MonthData;
    mar?: MonthData;
    apr?: MonthData;
    may?: MonthData;
    jun?: MonthData;
    jul?: MonthData;
    aug?: MonthData;
    sep?: MonthData;
    oct?: MonthData;
    nov?: MonthData;
    dec?: MonthData;
  };
}

export interface EnrollmentPayment {
  id: string;
  enrollment: Enrollment;
  payment_month: number;
  payment_year: number;
  amount: number;
}

export interface GradeLevel {
  id: string;
  level: string;
  name: string;
  description: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface Student {
  id: string;
  student_number: string;
  date_of_birth: string;
  gender: string;
  is_active: string;
  user: User;
  current_grade: GradeLevel;
  current_academic_year: AcademicYear;
}

export interface Teacher {
  id: string;
  department: string;
  specialization: string;
  hire_date: string;
  office_location: string;
  user: User;
  office_hours: string;
  bio: string;
  is_active: boolean;
}

export interface DigitalFile {
  created_at?: string;
  id: string;
  attachment_id: string;
  file_name: string;
  updated_at?: string;
  url: string;
}

export interface VariationOption {
  name?: string;
  value?: string;
}

export interface VariationOptionInput {
  name?: string;
  value?: string;
}

export interface Attachment {
  thumbnail: string;
  original: string;
  id?: string;
}

export interface AttachmentInput {
  thumbnail: string;
  original: string;
  id?: string;
  file_name?: string;
}

export interface ConnectTypeBelongsTo {
  connect?: string;
}

export interface IImage {
  __typename?: string;
  id: string;
  thumbnail: string;
  original: string;
}

export interface Shop {
  id?: string;
  owner_id?: number;
  owner?: User;
  staffs?: User[];
  is_active?: boolean;
  orders_count?: number;
  products_count?: number;
  balance?: Balance;
  name?: string;
  slug?: string;
  description?: string;
  cover_image: IImage;
  logo: IImage;
  address?: UserAddress;
  settings?: ShopSettings;
  created_at?: string;
  updated_at?: string;
  ownership_history?: {
    status: OwnerShipTransferStatus;
  };
}

export interface Balance {
  id?: string;
  admin_commission_rate?: number;
  shop?: Shop;
  total_earnings?: number;
  withdrawn_amount?: number;
  current_balance?: number;
  payment_info?: PaymentInfo;
}

export interface PaymentInfo {
  account: number;
  name: string;
  email: string;
  bank: string;
}

export interface PaymentInfoInput {
  account: number;
  name: string;
  email: string;
  bank: string;
}

export interface BalanceInput {
  id?: string;
  payment_info: PaymentInfoInput;
}

export interface shopMaintenance {
  image: Attachment;
  title: string;
  description: string;
  start: Date;
  until: Date;
}
export interface ShopSettings {
  socials?: ShopSocials[];
  contact: string;
  location: Location;
  website: string;
  notifications: {
    email: string;
    enable: boolean;
  };
  askForAQuote: {
    enable: boolean;
    content: string;
    quote: string;
  };
  isShopUnderMaintenance?: string;
  shopMaintenance: shopMaintenance;
}

export interface Location {
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
}

export interface ShopSocials {
  icon?: string;
  url?: string;
}

export interface UserAddress {
  country?: string;
  city?: string;
  state?: string;
  zip?: string;
  street_address?: string;
}

export interface MakeAdminInput {
  user_id: string;
}

export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  display_name: string;
  shops: Shop[];
  managed_shop: Shop;
  is_active: boolean;
  email: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  address: Address[];
  email_verified: boolean;
}

export interface Domain {
  id: String;
  url: String;
}
export interface LicenseAdditionalData {
  quotaExceeded: boolean;
  supportValid: boolean;
  licenseValid: boolean;
  licenseRemaining: string;
  purchaseUrl: string;
}

export interface UpdateUser {
  display_name?: string;
  // profile?: UserProfileInput;
  // address?: UserAddressUpsertInput[];
}

export interface Profile {
  id: string;
  avatar?: Attachment;
  bio?: string;
  contact?: string;
  socials?: Social[];
  customer?: User;
}

export interface Social {
  type?: string;
  link?: string;
}

export interface Address {
  id: string;
  title?: string;
  default?: boolean;
  address?: UserAddress;
  type?: string;
  customer?: User;
  location: GoogleMapLocation;
}

export interface StoreNotice {
  id: string;
  translated_languages: string[];
  priority: StoreNoticePriorityType;
  notice: string;
  description?: string;
  effective_from?: string;
  expired_at: string;
  type?: string;
  is_read?: boolean;
  shops?: Shop[];
  users?: User[];
  received_by?: string;
  created_by: string;
  expire_at: string;
  created_at: string;
  creator_role: string;
  updated_at: string;
  deleted_at?: string;
  creator?: any;
}

export interface StoreNoticeInput {
  priority: string;
  notice: string;
  description?: string;
  effective_from?: string;
  expired_at: string;
  type: string;
  received_by?: string[];
}

export interface FAQs {
  id: string;
  translated_languages: string[];
  language: string;
  faq_title: string;
  slug: string;
  faq_description: string;
  shop_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface FAQsInput {
  faq_title: string;
  faq_description?: string;
  shop_id?: string;
  language?: string;
  slug?: string;
}

export interface FlashSaleInput {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  language?: string;
  slug?: string;
  image?: AttachmentInput;
  cover_image?: AttachmentInput;
  type: string;
  rate: string;
  sale_status: boolean;
  sale_builder: any;
}

export interface TermsAndConditions {
  id: string;
  translated_languages: string[];
  language: string;
  title: string;
  slug: string;
  description: string;
  shop_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  is_approved?: boolean;
}

export interface TermsAndConditionsInput {
  title: string;
  description?: string;
  shop_id?: string;
}

export interface StoreNoticeUserToNotifyInput {
  type: string;
}

export interface NotifyLogs {
  id: string;
  receiver: string;
  sender: string;
  notify_type: string;
  notify_receiver_type: string;
  is_read: boolean;
  notify_text: string;
}

export interface ReadAllNotifyLogs {
  set_all_read: boolean;
}

export interface CreateSubjectInput {
  name: string;
  slug: string;
}

export interface CreateAcademicYearInput {
  name: string;
  slug: string;
}

export interface CreateGradeLevelInput {
  name: string;
  level: number;
  description?: string;
}

export interface CreateUserInput {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
}
export interface CreateStudentInput {
  // username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string | null;
  // parent_guardian_name: string;
  // parent_guardian_phone: string;
  current_grade: string;
  current_academic_year: string;
}

export interface CreateTeacherInput {
  department: string;
  specialization?: string;
  hire_date?: string;
  office_location?: string;
  office_hours?: string;
  bio?: string;
  is_active?: boolean;
}

export interface CreateCourseInput {
  name: string;
  slug: string;
}

export interface CreateCourseOfferingInput {
  course: string;
  teacher: string;
  grade_level: string;
  year: number;
  batch: number;
  fee: number;
}

export interface CreateEnrollmentInput {
  course_offering: string;
  student: string;
}

export interface CreateEnrollmentPaymentInput {
  enrollment_id: string;
  student: string;
  amount: number;
}

export interface CreateWithdrawInput {
  amount: number;
  shop_id: number;
  payment_method?: string;
  details?: string;
  note?: string;
}

// -> TODO: Simplify this
export interface MappedPaginatorInfo {
  currentPage: number;
  firstPageUrl: string;
  from: number;
  lastPage: number;
  lastPageUrl: string;
  links: any[];
  nextPageUrl: string | null;
  path: string;
  perPage: number;
  prevPageUrl: string | null;
  to: number;
  total: number;
  hasMorePages: boolean;
}

export interface CardInput {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  email?: string;
}

export interface CreateNotifyLogsInput {
  id: string;
  receiver: string;
  sender: string;
  notify_type: string;
  notify_receiver_type: string;
  is_read: boolean;
  notify_text: string;
}

export interface AbusiveReport {
  id?: number;
  user_id?: number;
  user: User[];
  model_id: number;
  model_type: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAbuseReportInput {
  model_id: string;
  model_type: string;
  message: string;
}

export interface CreateMessageInput {
  message: string;
  id: string;
  shop_id: string;
}
export interface CreateMessageSeenInput {
  id: string;
}

export interface SettingsOptions {
  siteTitle?: string;
  siteSubtitle?: string;
  currency?: string;
  defaultAi?: string;
  useOtp?: boolean;
  useAi?: boolean;
  useGoogleMap?: boolean;
  isProductReview?: boolean;
  freeShipping?: boolean;
  contactDetails?: ContactDetails;
  minimumOrderAmount?: number;
  freeShippingAmount?: number;
  currencyToWalletRatio?: number;
  signupPoints?: number;
  maxShopDistance?: number;
  maximumQuestionLimit?: number;
  deliveryTime?: DeliveryTime[];
  logo?: Attachment;
  taxClass?: string;
  shippingClass?: string;
  seo?: SeoSettings;
  google?: GoogleSettings;
  facebook?: FacebookSettings;
  paymentGateway?: any;
  defaultPaymentGateway?: string;
  guestCheckout: boolean;
  smsEvent?: SmsEvent;
  emailEvent?: EmailEvent;
  pushNotification?: PushNotification;
  server_info?: ServerInfo;
  enableEmailForDigitalProduct?: boolean;
}

export interface ContactDetails {
  socials?: ShopSocials[];
  contact?: string;
  location?: Location;
  website?: string;
}

export interface Location {
  lat?: number;
  lng?: number;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
}

export interface LatestMessage {
  body: string;
  conversation_id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  id: string;
}

export interface Conversations {
  id: string;
  created_at: string;
  updated_at: string;
  shop_id: number;
  unseen?: boolean;
  user_id: string;
  user: User;
  shop: Shop;
  latest_message: LatestMessage;
}

export interface Message extends LatestMessage {
  conversation: Conversations;
}

export interface ShopSocials {
  icon?: string;
  url?: string;
}

export interface FacebookSettings {
  appId?: string;
  isEnable?: boolean;
  pageId?: string;
}

export interface GoogleSettings {
  isEnable?: boolean;
  tagManagerId?: string;
}

export type SeoSettings = {
  canonicalUrl?: string;
  metaDescription?: string;
  metaTags?: string;
  metaTitle?: string;
  ogDescription?: string;
  ogImage?: Attachment;
  ogTitle?: string;
  twitterCardType?: string;
  twitterHandle?: string;
};

export interface Settings {
  id: string;
  language: string;
  options: SettingsOptions;
}

export interface PromoPopupFormValues {
  image?: Attachment;
  title?: string;
  description?: string;
  popUpDelay?: number;
  popUpExpiredIn?: number;
  isPopUpNotShow?: boolean;
  popUpNotShow?: {
    title?: string;
    popUpExpiredIn?: number;
  };
}

export interface SettingsInput {
  language?: string;
  options?: SettingsOptionsInput;
}

export interface Tax {
  id?: string;
  name?: string;
  rate?: number;
  is_global?: boolean;
  country?: string;
  state?: string;
  zip?: string;
  city?: string;
  priority?: number;
  on_shipping?: boolean;
}

export interface TaxInput {
  name?: string;
  rate?: number;
  is_global?: boolean;
  country?: string;
  state?: string;
  zip?: string;
  city?: string;
  priority?: number;
  on_shipping?: boolean;
}

export interface SeoSettingsInput {
  metaTitle?: string;
  metaDescription?: string;
  metaTags?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: AttachmentInput;
  twitterHandle?: string;
  twitterCardType?: string;
}

export interface GoogleSettingsInput {
  isEnable?: boolean;
  tagManagerId?: string;
}

export interface FacebookSettingsInput {
  isEnable?: boolean;
  appId?: string;
  pageId?: string;
}

export interface SettingsOptions {
  siteTitle?: string;
  siteSubtitle?: string;
  currency?: string;
  defaultAi?: string;
  paymentGateway?: any;
  defaultPaymentGateway?: string;
  useOtp?: boolean;
  useAi?: boolean;
  contactDetails?: ContactDetails;
  minimumOrderAmount?: number;
  currencyToWalletRatio?: number;
  signupPoints?: number;
  maxShopDistance?: number;
  maximumQuestionLimit?: number;
  deliveryTime?: DeliveryTime[];
  logo?: Attachment;
  collapseLogo?: Attachment;
  taxClass?: string;
  shippingClass?: string;
  seo?: SeoSettings;
  google?: GoogleSettings;
  facebook?: FacebookSettings;
  useEnableGateway?: boolean;
  currencyOptions?: SettingCurrencyOptions;
  guestCheckout: boolean;
  smsEvent?: SmsEvent;
  emailEvent?: EmailEvent;
  pushNotification?: PushNotification;
  server_info?: ServerInfo;
  enableTerms?: boolean;
  enableCoupons?: boolean;
  maintenance: Maintenance;
  isUnderMaintenance: boolean;
  enableEmailForDigitalProduct?: boolean;
  isPromoPopUp?: boolean;
  promoPopup?: PromoPopupFormValues;
  reviewSystem?: string;
  useGoogleMap?: boolean;
  isProductReview?: boolean;
  freeShipping?: boolean;
  freeShippingAmount?: number;
  isMultiCommissionRate?: boolean;
}

// *************** OLD Code ***************
// export interface SettingsOptions {
//   siteTitle?: string;
//   siteSubtitle?: string;
//   currency?: string;
//   defaultAi?: string;
//   useOtp?: boolean;
//   useAi?: boolean;
//   useGoogleMap?: boolean;
//   isProductReview?: boolean;
//   freeShipping?: boolean;
//   contactDetails?: ContactDetails;
//   minimumOrderAmount?: number;
//   freeShippingAmount?: number;
//   currencyToWalletRatio?: number;
//   signupPoints?: number;
//   maxShopDistance?: number;
//   maximumQuestionLimit?: number;
//   deliveryTime?: DeliveryTime[];
//   logo?: Attachment;
//   taxClass?: string;
//   shippingClass?: string;
//   seo?: SeoSettings;
//   google?: GoogleSettings;
//   facebook?: FacebookSettings;
//   paymentGateway?: any;
//   defaultPaymentGateway?: string;
//   guestCheckout: boolean;
//   smsEvent?: SmsEvent;
//   emailEvent?: EmailEvent;
//   pushNotification?: PushNotification;
//   server_info?: ServerInfo;
// }

export interface Maintenance {
  image: Attachment;
  title: string;
  description: string;
  start: string;
  until: string;
  isUnderMaintenance: boolean;
}

export interface ServerInfo {
  max_execution_time?: string;
  max_input_time?: string;
  memory_limit?: string;
  post_max_size?: number;
  upload_max_filesize?: number;
}

export interface SettingsOptionsInput {
  siteTitle?: string;
  siteSubtitle?: string;
  currency?: string;
  useOtp?: boolean;
  useAi?: boolean;
  defaultAi?: any;
  freeShipping?: boolean;
  useCashOnDelivery?: boolean;
  paymentGateway?: any;
  defaultPaymentGateway?: string;
  contactDetails?: ContactDetailsInput;
  minimumOrderAmount?: number;
  freeShippingAmount?: number;
  currencyToWalletRatio?: number;
  signupPoints?: number;
  maxShopDistance?: number;
  maximumQuestionLimit?: number;
  deliveryTime?: DeliveryTimeInput[];
  logo?: AttachmentInput;
  taxClass?: string;
  shippingClass?: string;
  seo?: SeoSettingsInput;
  google?: GoogleSettingsInput;
  facebook?: FacebookSettingsInput;
  currencyOptions?: SettingCurrencyOptions;
  useEnableGateway?: boolean;
  guestCheckout?: boolean;
  smsEvent?: SmsEvent;
  emailEvent?: EmailEvent;
  pushNotification?: PushNotification;
  server_info?: ServerInfo;
  useGoogleMap?: boolean;
  enableTerms?: boolean;
  enableCoupons?: boolean;
  isProductReview?: boolean;
  enableEmailForDigitalProduct?: boolean;
  isPromoPopUp?: boolean;
  promoPopup?: PromoPopupFormValues;
  enableReviewPopup?: boolean;
  reviewSystem?: string;
}

export interface SmsEvent {
  admin?: SmsAdminEvent;
  vendor?: SmsVendorEvent;
  customer?: SmsCustomerEvent;
}

export interface PushNotification {
  all?: PushNotificationEvent;
}

export interface PushNotificationEvent {
  storeNotice?: boolean;
  order?: boolean;
  message?: boolean;
}

export interface SmsAdminEvent {
  createOrder?: boolean;
  deliverOrder?: boolean;
  cancelOrder?: boolean;
  statusChangeOrder?: boolean;
  refundOrder?: boolean;
}

export interface SmsCustomerEvent {
  createOrder?: boolean;
  deliverOrder?: boolean;
  cancelOrder?: boolean;
  statusChangeOrder?: boolean;
  refundOrder?: boolean;
}

export interface SmsVendorEvent {
  createOrder?: boolean;
  deliverOrder?: boolean;
  cancelOrder?: boolean;
  statusChangeOrder?: boolean;
  refundOrder?: boolean;
}

export interface EmailEvent {
  admin?: EmailAdminEvent;
  vendor?: EmailVendorEvent;
  customer?: EmailCustomerEvent;
}
export interface EmailAdminEvent {
  createOrder?: boolean;
  deliverOrder?: boolean;
  cancelOrder?: boolean;
  statusChangeOrder?: boolean;
  refundOrder?: boolean;
}
export interface EmailCustomerEvent {
  createOrder?: boolean;
  deliverOrder?: boolean;
  cancelOrder?: boolean;
  statusChangeOrder?: boolean;
  refundOrder?: boolean;
}
export interface EmailVendorEvent {
  createOrder?: boolean;
  deliverOrder?: boolean;
  cancelOrder?: boolean;
  statusChangeOrder?: boolean;
  refundOrder?: boolean;
}

export interface DeliveryTime {
  description?: string;
  title?: string;
}

export interface DeliveryTimeInput {
  title?: string;
  description?: string;
}

export interface ContactDetailsInput {
  socials?: ShopSocialInput[];
  contact?: string;
  location?: LocationInput;
  website?: string;
  emailAddress?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  shop_id?: number;
  // permission: Permission;
}

export interface ChangePasswordInput {
  old_password: string;
  new_password: string;
}

export interface ForgetPasswordInput {
  email: string;
}

export interface VerifyForgetPasswordTokenInput {
  token: string;
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  email: string;
  password: string;
}

export declare interface MakeAdminInput {
  user_id: string;
}

export interface BlockUserInput {
  id: number;
}

export interface WalletPointsInput {
  customer_id: string;
  points: number;
}
export interface KeyInput {
  license_key: string;
}

export declare type AddStaffInput = {
  email: string;
  password: string;
  name: string;
  shop_id: number;
};

export declare type ApproveShopInput = {
  id: string;
  admin_commission_rate: number;
  isCustomCommission: boolean;
};
export declare type TransferShopOwnershipInput = {
  shop_id: string | number;
  vendor_id: string | number;
  message?: string;
};

export interface LocationInput {
  lat?: number;
  lng?: number;
  street_number?: string;
  route?: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
}

export interface shopMaintenanceInput {
  image: Attachment;
  title: string;
  description: string;
  start: Date;
  until: Date;
}

export interface ShopSettingsInput {
  socials?: ShopSocialInput[];
  contact?: string;
  location?: LocationInput;
  website?: string;
  isShopUnderMaintenance?: string;
  shopMaintenance: shopMaintenanceInput;
}

export interface ReplyQuestion {
  question?: string;
  answer: string;
}

export interface RefundReason {
  id: string;
  name: string;
  slug: string;
  language: string;
  translated_languages: Array<string>;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface SocialInput {
  type?: string;
  link?: string;
}

export interface UserProfileInput {
  id: string;
  avatar?: AttachmentInput;
  bio?: string;
  socials?: SocialInput[];
  contact?: string;
}

export interface CategoryQueryOptions extends QueryOptions {
  type: string;
  name: string;
  parent: number | null;
  self: string;
}

export interface SubjectQueryOptions extends QueryOptions {
  name: string;
}

export interface AcademicYearQueryOptions extends QueryOptions {
  name: string;
}

export interface GradeLevelQueryOptions extends QueryOptions {
  name: string;
}

export interface StudentQueryOptions extends QueryOptions {
  name: string;
}

export interface StudentEnrollmentQueryOptions extends QueryOptions {
  name: string;
}

export interface TeacherQueryOptions extends QueryOptions {
  name: string;
}

export interface CourseQueryOptions extends QueryOptions {
  name: string;
}

export interface CourseOfferingQueryOptions extends QueryOptions {
  name: string;
  grade_level: string;
}

export interface UserQueryOptions extends QueryOptions {
  name: string;
}

export interface StudentEnrolledCourseQueryOptions extends QueryOptions {
  student_id: string;
  course_name: string;
}

export interface EnrollmentQueryOptions extends QueryOptions {
  name: string;
  grade_level: string;
  batch: string;
}

export interface EnrollmentPaymentQueryOptions extends QueryOptions {
  name: string;
}

export interface ConversationQueryOptions extends QueryOptions {
  search?: string;
}

export interface TagQueryOptions extends QueryOptions {
  type: string;
  name: string;
  parent: number | null;
}

export interface InvoiceTranslatedText {
  subtotal: string;
  discount: string;
  tax: string;
  delivery_fee: string;
  total: string;
  products: string;
  quantity: string;
  invoice_no: string;
  date: string;
}

export interface GenerateInvoiceDownloadUrlInput {
  order_id: string;
  translated_text?: InvoiceTranslatedText;
  is_rtl: boolean;
}

export interface AttributeQueryOptions extends QueryOptions {
  type: string;
  name: string;
  shop_id: string;
}

export interface AttributeValueQueryOptions extends QueryOptions {
  type: string;
  name: string;
}

export interface TaxQueryOptions extends QueryOptions {
  name: string;
}

export interface ShippingQueryOptions extends QueryOptions {
  name: string;
}

export interface AuthorQueryOptions extends QueryOptions {
  type: string;
  name: string;
  is_approved?: boolean;
}
export interface RefundPolicyQueryOptions extends QueryOptions {
  title: string;
  target: string;
  status: string;
}
export interface RefundReasonQueryOptions extends QueryOptions {
  name: string;
}

export interface TypeQueryOptions extends QueryOptions {
  name: string;
}

export interface AnalyticsQueryOptions extends QueryOptions {
  days?: number;
}

export interface ProductQueryOptions extends QueryOptions {
  type: string;
  name: string;
  categories: string;
  tags: string;
  author: string;
  price: string;
  manufacturer: string;
  status: string;
  is_active: string;
  shop_id: string;
  min_price: string;
  max_price: string;
  rating: string;
  question: string;
  user_id: string;
  flash_sale_builder: boolean;
  product_type: string;
  searchedByUser: string;
}

export interface UserQueryOptions extends QueryOptions {
  name: string;
  search?: string;
  is_active?: boolean;
  shop_id: string | number;
  exclude: string | number;
}

export interface ManufacturerQueryOptions extends QueryOptions {
  shop_id: string;
  name: string;
  is_approved: boolean;
  type: string;
}

export interface OrderStatusQueryOptions extends QueryOptions {
  name: string;
}

export interface StaffQueryOptions extends Omit<QueryOptions, 'language'> {
  shop_id: string;
}

export interface WithdrawQueryOptions extends Omit<QueryOptions, 'language'> {
  name: string;
  shop_id: string;
  parent: number | null;
}

export interface OrderQueryOptions extends QueryOptions {
  type: string;
  name: string;
  shop_id: string;
  tracking_number: string;
  refund_reason: string;
  with: string;
}

export interface NotifyLogsQueryOptions extends QueryOptions {
  notify_type: string;
  notify_receiver_type?: string;
  sender?: string;
  receiver: string;
  set_all_read?: boolean;
  is_read?: boolean;
}

export interface CouponQueryOptions extends QueryOptions {
  code: string;
  shop_id: string;
}
export interface StoreNoticeQueryOptions extends QueryOptions {
  notice: string;
  shops: string;
  'users.id': string;
}

export interface FAQsQueryOptions extends QueryOptions {
  faq_title: string;
  shop_id: string;
}

export interface FlashSaleQueryOptions extends QueryOptions {
  title?: string;
  shop_id?: string;
  slug?: string;
  request_from?: string;
}

export interface TermsAndConditionsQueryOptions extends QueryOptions {
  title: string;
  shop_id: string;
  is_approved?: boolean;
}

export interface VendorQueryOptionsType extends QueryOptionsType {
  is_active?: boolean;
}

export interface MessageQueryOptions extends QueryOptions {
  slug: string;
}

export interface QuestionQueryOptions extends Omit<QueryOptions, 'language'> {
  name: string;
  type: string;
  shop_id: string;
  product_id: number;
  answer: string;
}

export interface PendingPaymentQueryOptions extends Omit<QueryOptions, 'language'> {
  name: string;
  type: string;
  shop_id: string;
  product_id: number;
  answer: string;
}


export interface ReviewQueryOptions extends Omit<QueryOptions, 'language'> {
  name: string;
  type: string;
  shop_id: string;
  product_id: number;
}

export interface ShopQueryOptions extends Omit<QueryOptions, 'language'> {
  name: string;
  parent: number | null;
  is_active?: boolean;
}

export interface GoogleMapLocation {
  //@ts-ignore
  lat?: number;
  //@ts-ignore
  lng?: number;
  street_number?: string;
  route?: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
}
export interface SettingCurrencyOptions {
  formation?: any;
  fractions?: number;
}

export interface GenerateDescriptionInput {
  prompt: string;
}

export interface ItemProps {
  id: number;
  title: string;
}

export interface AnalyticsResponse {
  total_revenue: number;
  student_count: number;
  enrollment_count: number;
  active_enrollment_count: number;
}

export interface PendingPayment {
  student: Student;
}

export interface ShopPaginator extends PaginatorInfo<Shop> {}

export interface UserPaginator extends PaginatorInfo<User> {}

export interface PendingPaymentPaginator extends PaginatorInfo<PendingPayment> {}

export interface LicensedDomainPaginator extends PaginatorInfo<Domain> {}

export interface StaffPaginator extends PaginatorInfo<User> {}

export interface NotifyLogsPaginator extends PaginatorInfo<NotifyLogs> {}

export interface StoreNoticePaginator extends PaginatorInfo<StoreNotice> {}

export interface FAQsPaginator extends PaginatorInfo<FAQs> {}

export interface TermsAndConditionsPaginator
  extends PaginatorInfo<TermsAndConditions> {}

export interface SubjectPaginator extends PaginatorInfo<Subject> {}

export interface AcademicYearPaginator extends PaginatorInfo<AcademicYear> {}

export interface GradeLevelPaginator extends PaginatorInfo<GradeLevel> {}

export interface StudentPaginator extends PaginatorInfo<Student> {}

export interface TeacherPaginator extends PaginatorInfo<Teacher> {}

export interface CoursePaginator extends PaginatorInfo<Course> {}

export interface CourseOfferingPaginator
  extends PaginatorInfo<CourseOffering> {}

export interface EnrollmentPaginator extends PaginatorInfo<Enrollment> {}

export interface EnrollmentWithMonthsPaginator
  extends PaginatorInfo<EnrollmentWithMonth> {}

export interface EnrollmentPaymentPaginator
  extends PaginatorInfo<EnrollmentPayment> {}

export interface TaxPaginator extends PaginatorInfo<Tax> {}

export interface RefundReasonPaginator extends PaginatorInfo<RefundReason> {}

export interface ConversionPaginator extends PaginatorInfo<Conversations> {}

export interface MessagePaginator extends PaginatorInfo<Message> {}

export interface FlashSaleProductsRequestInput {
  title: string;
  flash_sale_id: string;
  // requested_product_ids: Product[];
  note?: string;
  language?: string;
}

export interface FlashSaleRequestedProductsQueryOptions
  extends ProductQueryOptions {
  vendor_request_id: string;
}

export interface MessagePaginator extends PaginatorInfo<Message> {}

export type MaintenanceFormValues = {
  isUnderMaintenance: boolean;
  maintenance: {
    image: Attachment;
    title: string;
    description: string;
    start: string;
    until: string;
    isOverlayColor: boolean;
    overlayColor: string;
    buttonTitleOne: string;
    buttonTitleTwo: string;
    overlayColorRange: string;
    newsLetterTitle: string;
    newsLetterDescription: string;
    aboutUsTitle: string;
    aboutUsDescription: string;
    contactUsTitle: string;
  };
};

export interface CommissionItem {
  id?: string;
  level: string;
  sub_level: string;
  description: string;
  min_balance: number;
  max_balance: number;
  commission: number;
  image: AttachmentInput;
}

export interface PurposeItem {
  title?: string;
  description?: string;
}

export interface SellingStepsItem {
  title?: string;
  description?: string;
}

export interface SellerFaqItem {
  title?: string;
  description?: string;
}

export interface Showcase {
  title: string;
  description: string;
  buttonName: string;
  buttonLink: string;
  button2Name: string;
  button2Link: string;
  image: AttachmentInput;
}

export interface BusinessPurposeItem {
  id?: string;
  description: string;
  title: string;
  icon: {
    value: string;
  };
}

export interface SellingStepItem {
  id?: string;
  description: string;
  title: string;
  image?: Attachment;
}

export interface BecomeSeller {
  language: string;
  page_options: {
    page_options: BecomeSellerOptions;
  };
  commissions: CommissionItem[];
}

export interface BecomeSellerOptions {
  banner: Attachment;
  sellingStepsTitle: string;
  sellingStepsDescription: string;
  sellingStepsItem: SellingStepItem[];
  purposeTitle: string;
  purposeDescription: string;
  purposeItems: BusinessPurposeItem[];
  commissionTitle: string;
  commissionDescription: string;
  faqTitle: string;
  faqDescription: string;
  faqItems: { description: string; title: string }[];
}

export interface UserStory {
  title: string;
  description: string;
  link: string;
  thumbnail: string;
}

export interface BecomeSellerOptionsInput {
  banner: {
    image: AttachmentInput;
    title: string;
    newsTickerTitle?: string;
    newsTickerURL?: string;
    description: string;
    button1Name?: string;
    button1Link?: string;
    button2Name?: string;
    button2Link?: string;
  };
  sellingStepsTitle: string;
  sellingStepsDescription: string;
  sellingStepsItem: SellingStepItem[];
  purposeTitle: string;
  purposeDescription: string;
  purposeItems: BusinessPurposeItem[];
  commissionTitle: string;
  commissionDescription: string;
  faqTitle: string;
  faqDescription: string;
  faqItems: { description: string; title: string }[];
  isMultiCommissionRate: boolean;
  defaultCommissionDetails?: string;
  defaultCommissionRate: number;
  dashboard: Showcase;
  sellerOpportunity: Showcase;
  guidelineTitle: string;
  guidelineDescription: string;
  guidelineItems: {
    title: string;
    link?: string;
  }[];
  userStoryTitle: string;
  userStoryDescription?: string;
  userStories: UserStory[];
  contact: {
    title: string;
    description: string;
  };
}

export interface BecomeSellerInput {
  language?: string;
  page_options: BecomeSellerOptionsInput;
  commissions: CommissionItem[];
}

export enum OwnerShipTransferStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface OwnershipTransferInput {
  id: string;
  transaction_identifier: string;
  from: string;
  shop_id: string;
  to: string;
  message: string;
  created_by: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface OwnershipTransferQueryOptions extends QueryOptions {
  transaction_identifier?: string;
  shop_id?: string;
  status?: string;
  type?: string;
  from?: string;
  to?: string;
}

export interface StickerCardProps {
  titleTransKey: string;
  icon?: JSX.Element;
  color?: string;
  price?: string | number;
  indicator?: 'up' | 'down';
  indicatorText?: string;
  note?: string;
  link?: string;
  linkText?: string;
  iconClassName?: string;
  subtitleTransKey?: string;
  iconBgStyle?: { [key: string]: string };
}

export interface OrderStickerCardProps extends StickerCardProps {
  key:
    | 'pending'
    | 'processing'
    | 'complete'
    | 'cancelled'
    | 'refunded'
    | 'failed'
    | 'localFacility'
    | 'outForDelivery'
    | 'total_earnings'
    | 'current_balance'
    | 'admin_commission_rate'
    | 'withdrawn_amount';
}
