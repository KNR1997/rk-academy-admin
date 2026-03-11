import cn from 'classnames';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
// utils
import {
  checkIsMaintenanceModeComing,
  checkIsMaintenanceModeStart,
} from '@/utils/constants';
import { RESPONSIVE_WIDTH } from '@/utils/constants';
import { useWindowSize } from '@/utils/use-window-size';
import { miniSidebarInitialValue } from '@/utils/constants';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
// components
import Scrollbar from '@/components/ui/scrollbar';
import Footer from '@/components/layouts/footer/footer-bar';
import OwnerInformation from '@/components/user/user-details';
import SideBarMenu from '@/components/layouts/coordinator/menu';
import Navbar from '@/components/layouts/navigation/top-navbar';
import MobileNavigation from '@/components/layouts/navigation/mobile-navigation';

const CoordinatorLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const { locale } = useRouter();
  const router = useRouter();
  const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';
  const { width } = useWindowSize();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);
  const [underMaintenance] = useAtom(checkIsMaintenanceModeComing);
  const [underMaintenanceStart] = useAtom(checkIsMaintenanceModeStart);

  return (
    <div
      className="flex flex-col min-h-screen transition-colors duration-150 bg-gray-100"
      dir={dir}
    >
      <Navbar />
      <MobileNavigation>
        <OwnerInformation />
        {!permission ? <SideBarMenu /> : null}
      </MobileNavigation>

      <div className="flex flex-1">
        <aside
          className={cn(
            'fixed bottom-0 z-10 hidden h-full w-72 bg-white shadow transition-[width] duration-300 ltr:left-0 ltr:right-auto rtl:right-0 rtl:left-auto lg:block',
            width >= RESPONSIVE_WIDTH &&
              (underMaintenance || underMaintenanceStart)
              ? 'lg:pt-[8.75rem]'
              : 'pt-20',
            miniSidebar && width >= RESPONSIVE_WIDTH ? 'lg:w-24' : 'lg:w-76',
          )}
        >
          <div className="w-full h-full overflow-x-hidden sidebar-scrollbar">
            <Scrollbar
              className="w-full h-full"
              options={{
                scrollbars: {
                  autoHide: 'never',
                },
                overflow: {
                  x: 'hidden',
                },
              }}
            >
              <OwnerInformation />
              {!permission ? <SideBarMenu /> : null}
            </Scrollbar>
          </div>
        </aside>
        <main
          className={cn(
            'relative flex w-full flex-col justify-start transition-[padding] duration-300',
            width >= RESPONSIVE_WIDTH &&
              (underMaintenance || underMaintenanceStart)
              ? 'lg:pt-[8.75rem]'
              : 'pt-[72px] lg:pt-20',
            miniSidebar && width >= RESPONSIVE_WIDTH
              ? 'ltr:lg:pl-24 rtl:lg:pr-24'
              : 'ltr:xl:pl-76 rtl:xl:pr-76 ltr:lg:pl-72 rtl:lg:pr-72 rtl:lg:pl-0',
          )}
        >
          <div className="h-full p-5 md:p-8">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
export default CoordinatorLayout;
