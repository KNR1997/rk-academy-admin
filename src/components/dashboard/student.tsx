import { useTranslation } from 'next-i18next';
// icons
import { ChecklistIcon } from '@/components/icons/summary/checklist';
// components
import Loader from '@/components/ui/loader/loader';
import StickerCard from '@/components/widgets/sticker-card';
import { useMyEnrollmentsPaginatedQuery } from '@/data/user';

export default function StudentDashboard() {
  const { t } = useTranslation();
  // query
  const { paginatorInfo, loading } = useMyEnrollmentsPaginatedQuery({});

  if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <div className="grid gap-7 md:gap-8 lg:grid-cols-2 2xl:grid-cols-12">
      <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
        <div className="mb-5 flex items-center justify-between md:mb-7">
          <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            {t('text-summary')}
          </h3>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StickerCard
            titleTransKey="sticker-card-title-course"
            subtitleTransKey="sticker-card-subtitle-rev"
            icon={<ChecklistIcon className="h-8 w-8" />}
            color="#1EAE98"
            price={paginatorInfo?.total}
          />
          {/* <StickerCard
            titleTransKey="sticker-card-title-student"
            subtitleTransKey="sticker-card-subtitle-order"
            icon={<CustomersIcon className="h-8 w-8" />}
            color="#865DFF"
            price={data?.student_count}
          />
          <StickerCard
            titleTransKey="sticker-card-title-enrollment"
            icon={<ChecklistIcon className="h-8 w-8" />}
            color="#D74EFF"
            price={data?.enrollment_count}
          />
          <StickerCard
            titleTransKey="sticker-card-title-active-enrollment"
            icon={<BasketIcon className="h-8 w-8" />}
            color="#E157A0"
            price={data?.active_enrollment_count}
          /> */}
        </div>
      </div>

      {/* <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
        <div className="mb-5 items-center justify-between sm:flex md:mb-7">
          <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            {t('text-order-status')}
          </h3>
          <div className="mt-3.5 inline-flex rounded-full bg-gray-100/80 p-1.5 sm:mt-0">
            {timeFrame
              ? timeFrame.map((time) => (
                  <div key={time.day} className="relative">
                    <Button
                      className={cn(
                        '!focus:ring-0  relative z-10 !h-7 rounded-full !px-2.5 text-sm font-medium text-gray-500',
                        time.day === activeTimeFrame ? 'text-accent' : '',
                      )}
                      type="button"
                      onClick={() => setActiveTimeFrame(time.day)}
                      variant="custom"
                    >
                      {time.name}
                    </Button>
                    {time.day === activeTimeFrame ? (
                      <motion.div className="absolute bottom-0 left-0 right-0 z-0 h-full rounded-3xl bg-accent/10" />
                    ) : null}
                  </div>
                ))
              : null}
          </div>
        </div>
      </div> */}

      {/* <div className="lg:col-span-full 2xl:col-span-8">
        <ColumnChart
          widgetTitle={t('common:sale-history')}
          colors={['#6073D4']}
          series={salesByYear}
          categories={[
            t('common:january'),
            t('common:february'),
            t('common:march'),
            t('common:april'),
            t('common:may'),
            t('common:june'),
            t('common:july'),
            t('common:august'),
            t('common:september'),
            t('common:october'),
            t('common:november'),
            t('common:december'),
          ]}
        />
      </div> */}
    </div>
  );
}
