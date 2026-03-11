import dayjs from 'dayjs';
import cn from 'classnames';
import utc from 'dayjs/plugin/utc';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';
import { Routes } from '@/config/routes';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
// hooks
import { useMessageSeen } from '@/data/conversations';
// types
import { Conversations } from '@/types';
// utils
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
// components
import Link from '@/components/ui/link';
import Avatar from '@/components/common/avatar';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  conversation: Conversations;
  className?: string;
}

const UserListView = ({ conversation, className, ...rest }: Props) => {
  const router = useRouter();
  const { mutate: createSeenMessage } = useMessageSeen();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);
  // const routes = permission
  //   ? Routes?.message?.details(conversation?.id)
  //   : Routes?.shopMessage?.details(conversation?.id);
  const routes = Routes?.message?.details(conversation?.id);
  const seenMessage = (unseen: boolean) => {
    if (unseen) {
      createSeenMessage({
        id: conversation?.id,
      });
    }
  };

  const getConversationName = (conversation: Conversations) => {
    if (!conversation?.participants?.length) return '';

    return conversation.participants
      .map((p) => {
        if (p.user?.full_name) {
          return p.user.full_name;
        } else if (p.user?.display_name) {
          return p.user.display_name;
        }
        return 'Unknown User'; // Fallback if neither exists
      })
      .join(', ');
  };

  return (
    <Link
      href={routes}
      // onClick={() => seenMessage(Boolean(conversation?.unseen))}
      {...rest}
      className={twMerge(
        cn(
          'flex w-full gap-2 border-l-4 border-b border-b-[#E7E7E7] p-5',
          // Boolean(conversation?.unseen)
          //   ? 'border-l-accent'
          //   : 'border-l-[#E7E7E7]',
          Number(router?.query?.id) === Number(conversation?.id)
            ? 'border-l-[#F3F3F3] bg-[#F3F3F3]'
            : '',
          className,
        ),
      )}
    >
      <div className="h-10 w-10 shrink-0">
        <Avatar
          // src={conversation?.shop?.logo?.original}
          // name={String(conversation?.shop?.name)}
          name={getConversationName(conversation)}
          className={cn(
            'relative h-full w-full border-0',
            // conversation?.shop?.logo?.original
            //   ? ''
            //   : 'bg-muted-black text-base font-medium text-white',
          )}
        />
      </div>
      <div className="flex flex-1">
        {/* this section modify to view the participants (first_name) */}
        <div className="flex-1 pr-2">
          <h2 className="text-sm font-semibold capitalize leading-none text-muted-black">
            {getConversationName(conversation)}
          </h2>
          {/* {!isEmpty(conversation?.latest_message?.body) ? (
            <h2 className="flex items-center gap-1 text-sm font-semibold capitalize leading-none text-muted-black">
              {conversation?.shop?.name}
              {Boolean(conversation?.unseen) ? (
                <span className="block h-2 w-2 rounded-full bg-accent"></span>
              ) : (
                ''
              )}
            </h2>
          ) : (
            ''
          )} */}

          {/* {isEmpty(conversation?.latest_message?.body) ? (
            <h2 className="text-sm font-semibold capitalize leading-none text-muted-black">
              {conversation?.shop?.name}
            </h2>
          ) : (
            <p className="mt-2 text-xs text-[#666]">
              {conversation?.latest_message?.body?.length >= 40
                ? conversation?.latest_message?.body?.substring(0, 40) + '...'
                : conversation?.latest_message?.body}
            </p>
          )} */}
        </div>
        <div>
          {conversation?.created_at ? (
            <p className="text-[0.625rem] font-normal text-[#666]">
              {dayjs().to(dayjs.utc(conversation?.created_at))}
            </p>
          ) : (
            ''
          )}
          {/* {conversation?.latest_message?.created_at ? (
            <p className="text-[0.625rem] font-normal text-[#666]">
              {dayjs().to(dayjs.utc(conversation?.latest_message?.created_at))}
            </p>
          ) : (
            ''
          )} */}
        </div>
      </div>
    </Link>
  );
};

export default UserListView;
