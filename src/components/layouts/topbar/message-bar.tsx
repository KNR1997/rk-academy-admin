import dayjs from 'dayjs';
import cn from 'classnames';
import Image from 'next/image';
import utc from 'dayjs/plugin/utc';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'next-i18next';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
// config
import { Config } from '@/config';
import { Routes } from '@/config/routes';
// types
import { Conversations, SortOrder } from '@/types';
// hooks
import { useNotifyLogAllReadMutation } from '@/data/notify-logs';
import { useConversationsQuery, useMessageSeen } from '@/data/conversations';
// utils
import { LIMIT } from '@/utils/constants';
import { PusherConfig } from '@/utils/pusher-config';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
// components
import Link from '@/components/ui/link';
import Avatar from '@/components/common/avatar';
import { MessageIcon } from '@/components/icons/sidebar/message';
import { MessageAvatarPlaceholderIcon } from '@/components/icons/message-avatar-placeholder-icon';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  user: any;
};

const MessageBar = ({ user }: IProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  let permission = hasAccess(adminOnly, permissions);
  // states
  let allNotice: any = [];
  const [notice, setNotice] = useState([]);
  const [conversationsOpen, setConversationsOpen] = useState(false);
  // mutations
  const { mutate: createSeenMessage } = useMessageSeen();
  const { mutate: readAllNotifyLogs, isLoading: creating } =
    useNotifyLogAllReadMutation();
  // query
  let { conversations } = useConversationsQuery({
    limit: 5,
    sortedBy: SortOrder.Desc,
    // orderBy: 'updated_at',
  });

  const markAllAsRead = () => {
    readAllNotifyLogs({
      set_all_read: true,
      notify_type: 'message',
      receiver: user?.id,
    });
  };
  // const activeStatus = conversations.find(({ unseen }) => unseen);

  useEffect(() => {
    if (Config.broadcastDriver === 'pusher' && Config.pusherEnable === 'true') {
      const channelName =
        `${process.env.NEXT_PUBLIC_MESSAGE_CHANNEL_PRIVATE}` + '.' + user?.id;
      const channel = PusherConfig.subscribe(channelName);

      channel.bind(`${process.env.NEXT_PUBLIC_MESSAGE_EVENT}`, (data: any) => {
        allNotice.push(data);
        //@ts-ignore
        setNotice(allNotice);
        toast.success(data?.message, {
          toastId: 'messageSuccess',
        });
      });

      return () => {
        PusherConfig.unsubscribe(channelName);
      };
    } else {
      PusherConfig.disconnect();
    }
  }, [notice]);

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

  // here messages will be passed as a props in eventData. to keep the useEffect track of having a new message
  return (
    <>
      <Menu as="div" className="inline-block text-left sm:relative">
        <Menu.Button
          className={cn(
            'relative flex h-9 w-9 items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 text-gray-600 before:absolute before:top-0 before:right-0 before:h-2 before:w-2 before:rounded-full focus:outline-none data-[headlessui-state=open]:bg-white data-[headlessui-state=open]:text-accent',
            // activeStatus?.unseen ? 'before:bg-accent' : null,
          )}
        >
          <MessageIcon
            className={cn('h-5 w-5')}
            onClick={() => setConversationsOpen(!conversationsOpen)}
          />
        </Menu.Button>

        {/* <MessageBox
          eventName={`${process.env.NEXT_PUBLIC_MESSAGE_EVENT}`}
          eventChannel={`${process.env.NEXT_PUBLIC_MESSAGE_CHANNEL_PRIVATE}`}
          eventData={conversations}
          user={user}
          title={t('text-messages')}
        /> */}

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            as="div"
            className="absolute top-16 z-30 w-80 rounded-lg border border-gray-200 bg-white shadow-box end-2 origin-top-end focus:outline-none sm:top-12 sm:mt-0.5 sm:end-0 lg:top-14 lg:mt-0"
          >
            <Menu.Item>
              <>
                <div className="flex items-center justify-between rounded-tl-lg rounded-tr-lg border-b border-gray-200/80 px-5 py-4 font-medium">
                  <span>{t('text-messages')}</span>
                  {/* {activeStatus?.unseen ? (
                    <span
                      className="block cursor-pointer text-sm font-medium text-accent hover:text-heading"
                      onClick={markAllAsRead}
                    >
                      {t('text-mark-all-read')}
                    </span>
                  ) : (
                    ''
                  )} */}
                </div>
                <div className="py-0">
                  {conversations?.length ? (
                    conversations?.map((item: Conversations) => {
                      const routes = permission
                        ? Routes?.message?.details(item?.id)
                        : // : Routes?.shopMessage?.details(item?.id);
                          '';

                      const seenMessage = (unseen: boolean) => {
                        if (unseen) {
                          createSeenMessage({
                            id: item?.id,
                          });
                        }
                      };
                      return (
                        <div
                          className="group cursor-pointer border-b border-dashed border-gray-200 last:border-b-0"
                          key={item?.id}
                        >
                          <div
                            className={cn(
                              'flex gap-2 rounded-md py-3.5 px-5 text-sm font-semibold capitalize transition duration-200 hover:text-accent group-hover:bg-gray-100/70',
                            )}
                            onClick={() => {
                              router.push(`${routes}`);
                              // seenMessage(Boolean(item?.unseen));
                            }}
                          >
                            <div className="flex w-full items-center gap-x-3">
                              {/* <div className="relative h-8 w-8 shrink-0 grow-0 basis-auto rounded-full 2xl:h-9 2xl:w-9">
                                {item?.unseen ? (
                                  <span className="absolute top-0 right-0 z-10 h-2.5 w-2.5 rounded-full border border-white bg-blue-700"></span>
                                ) : (
                                  ''
                                )}
                                {!isEmpty(item?.shop?.logo?.thumbnail) ? (
                                  <Image
                                    // @ts-ignore
                                    src={item?.shop?.logo?.thumbnail}
                                    alt={String(item?.shop?.name)}
                                    fill
                                    sizes="(max-width: 768px) 100vw"
                                    className="product-image rounded-full object-contain"
                                  />
                                ) : (
                                  <MessageAvatarPlaceholderIcon
                                    className="text-[2rem] 2xl:text-[2.5rem]"
                                    color="#DDDDDD"
                                  />
                                )}
                              </div> */}
                              <div className="relative h-8 w-8 shrink-0 grow-0 basis-auto rounded-full 2xl:h-9 2xl:w-9">
                                {/* {true ? (
                                  <span className="absolute top-0 right-0 z-10 h-2.5 w-2.5 rounded-full border border-white bg-blue-700"></span>
                                ) : (
                                  ''
                                )} */}
                                <Avatar
                                  name={getConversationName(item)}
                                  className={cn(
                                    'relative h-full w-full border-0',
                                    // conversation?.shop?.logo?.original
                                    //   ? ''
                                    //   : 'bg-muted-black text-base font-medium text-white',
                                  )}
                                />
                              </div>
                              <div className="block w-10/12">
                                <div className="flex items-center justify-between">
                                  <h2 className="mr-1 w-[70%] truncate text-sm font-semibold">
                                    {getConversationName(item)}
                                  </h2>
                                  {item?.created_at ? (
                                    <p className="truncate text-xs font-normal text-[#686D73]">
                                      {dayjs().to(dayjs.utc(item?.created_at))}
                                    </p>
                                  ) : (
                                    ''
                                  )}
                                </div>
                                {!isEmpty(item?.latest_message?.body) ? (
                                  <p className="mt-1 truncate text-xs font-normal text-[#64748B]">
                                    {item?.latest_message?.body}
                                  </p>
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="mb-2 pt-5 pb-4 text-center text-sm font-medium text-gray-500">
                      {t('no-message-found')}
                    </p>
                  )}
                </div>
                <Link
                  href={
                    permission
                      ? Routes?.notifyLogs?.list
                      : `${Routes?.ownerDashboardNotifyLogs}/user/${user?.id}`
                  }
                  className="block border-t border-gray-200/80 p-3 text-center text-sm font-medium text-accent hover:text-accent-hover"
                >
                  {t('text-see-all-notification')}
                </Link>
              </>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default MessageBar;
