import StickerCard from '@/components/widgets/sticker-card';
import usePrice from '@/utils/use-price';
import { useTranslation } from 'next-i18next';
import { EaringIcon } from '@/components/icons/summary/earning';
import { BasketIcon } from '@/components/icons/summary/basket';
import { ChecklistIcon } from '@/components/icons/summary/checklist';
import { CustomersIcon } from '../icons/summary/customers';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-7 md:gap-8 lg:grid-cols-2 2xl:grid-cols-12">
      <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
        <div className="mb-5 flex items-center justify-between md:mb-7">
          <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            {t('text-summary')}
          </h3>
        </div>

        {/* <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StickerCard
            titleTransKey="sticker-card-title-rev"
            subtitleTransKey="sticker-card-subtitle-rev"
            icon={<EaringIcon className="h-8 w-8" />}
            color="#1EAE98"
            price={total_revenue}
          />
          <StickerCard
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
          />
        </div> */}
      </div>
    </div>
  );
}
