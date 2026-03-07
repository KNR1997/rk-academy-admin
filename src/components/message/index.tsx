// utils
import { RESPONSIVE_WIDTH } from '@/utils/constants';
import { useWindowSize } from '@/utils/use-window-size';
// components
import Card from '@/components/common/card';
import UserListIndex from '@/components/message/user-list-index';
import UserMessageIndex from '@/components/message/user-message-index';
import ResponsiveView from '@/components/message/views/responsive-vew';

export default function MessagePageIndex() {
  const { width } = useWindowSize();
  return (
    <>
      <div
        className="h-full overflow-hidden"
        style={{ maxHeight: 'calc(100% - 5px)' }}
      >
        {width >= RESPONSIVE_WIDTH ? (
          <div className="flex h-full flex-wrap gap-6 overflow-hidden">
            <UserListIndex />

            <UserMessageIndex />
          </div>
        ) : (
          <ResponsiveView />
        )}
      </div>
    </>
  );
}
