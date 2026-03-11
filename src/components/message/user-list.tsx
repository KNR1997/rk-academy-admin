import cn from 'classnames';
import { SortOrder } from '@/types';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useRef } from 'react';
// hooks
import { useConversationsQuery } from '@/data/conversations';
// utils
import { LIMIT } from '@/utils/constants';
// components
import Scrollbar from '@/components/ui/scrollbar';
import Loader from '@/components/ui/loader/loader';
import ErrorMessage from '@/components/ui/error-message';
import ListView from '@/components/message/views/list-view';
import UserListNotFound from '@/components/message/views/conversation-not-found';

interface Props {
  className?: string;
  filterText?: any;
  permission: boolean;
}

const UserList = ({ className, filterText, permission, ...rest }: Props) => {
  const { t } = useTranslation();
  const loadMoreRef = useRef(null);
  // query
  let {
    conversations,
    loading,
    error,
    refetch,
    isSuccess,
    hasMore,
    loadMore,
    isLoadingMore,
  } = useConversationsQuery({
    // search:
    //   filterText?.length >= 3
    //     ? (filterText?.trim()?.toLowerCase() ?? '')
    //     : null,
    limit: LIMIT,
    sortedBy: SortOrder.Desc,
  });
  let filterTimeout: any;
  useEffect(() => {
    // filter text
    clearTimeout(filterTimeout);
    if (
      Boolean(filterText?.length >= 3) &&
      (filterText || isEmpty(filterText))
    ) {
      filterTimeout = setTimeout(() => {
        refetch();
      }, 500);
    }

    if (!hasMore) {
      return;
    }

    const option = { threshold: 0 };

    const handleObserver = (entries: any[]) =>
      entries?.forEach((entry) => entry?.isIntersecting && loadMore());

    const observer = new IntersectionObserver(handleObserver, option);

    const element = loadMoreRef && loadMoreRef?.current;

    if (!element) {
      return;
    }

    observer?.observe(element);
  }, [loadMoreRef?.current, filterText, hasMore]);

  // if (loading)
  //   return (
  //     <Loader
  //       className="!h-auto flex-grow"
  //       showText={false}
  //       text={t('common:text-loading')}
  //     />
  //   );
  if (loading && isEmpty(conversations)) {
    return (
      <Loader
        className="!h-full flex-grow"
        showText={false}
        text={t('common:text-loading')}
      />
    );
  }
  if (!loading && isEmpty(conversations)) {
    return <UserListNotFound />;
  }
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className={cn('flex-auto', permission ? 'pb-6' : '')} {...rest}>
        {!isEmpty(conversations) ? (
          <>
            <Scrollbar
              className="h-full w-full"
              options={{
                scrollbars: {
                  autoHide: 'never',
                },
              }}
            >
              {isSuccess &&
                conversations?.map((conversation: any, key: number) => (
                  <ListView
                    key={key}
                    conversation={conversation}
                    className={className}
                  />
                ))}
              {hasMore ? (
                <div className="loader" ref={loadMoreRef}>
                  {isLoadingMore ? (
                    <Loader className="mt-4 !h-auto" showText={false} />
                  ) : (
                    <div className="hidden">{t('text-no-search')}</div>
                  )}
                </div>
              ) : (
                ''
              )}
            </Scrollbar>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default UserList;
