import Image from 'next/image';
import classNames from 'classnames';
// types
import { Enrollment, EnrollmentStatusType } from '@/types';
// configs
import { Routes } from '@/config/routes';
// components
import Link from '@/components/ui/link';
import Badge from '@/components/ui/badge/badge';
import { MapPinIcon } from '@/components/icons/map-pin';
import { PhoneOutlineIcon } from '@/components/icons/phone';

type CourseCardProps = {
  enrollment: Enrollment;
};

const CourseCard: React.FC<CourseCardProps> = ({ enrollment }) => {
  const courseOffering = enrollment?.course_offering;

  return (
    <Link
      href={Routes.myCourses.details(enrollment?.id)}
      className="overflow-hidden rounded-lg bg-white"
    >
      <div
        className={classNames(
          'relative flex h-22 justify-end overflow-hidden',
          // shop?.cover_image?.original ? '' : 'flex justify-end'
        )}
      >
        <Image
          alt="card"
          // src={shop?.cover_image?.original ?? '/topographic.svg'}
          src={'/topographic.svg'}
          // fill
          width={350}
          height={88}
          sizes="(max-width: 768px) 100vw"
          // className={classNames(
          //   shop?.cover_image?.original
          //     ? 'h-full w-full object-cover'
          //     : 'h-auto w-auto object-contain'
          // )}
          className="h-auto w-auto object-contain"
        />
      </div>
      <div className="relative z-10 -mt-[4.25rem] ml-6 flex flex-wrap items-center gap-3">
        {/* <ShopAvatar is_active={true} name={course?.name} logo={course?.logo} /> */}
        <div className="relative max-w-[calc(100%-104px)] flex-auto pr-4 pt-2">
          {courseOffering && (
            <h3 className="text-base font-medium leading-none text-muted-black">
              {courseOffering.course.name} {courseOffering.year} -{' '}
              {courseOffering.grade_level.name}
            </h3>
          )}
          <div className="mt-2 flex w-11/12 items-center gap-1 text-xs leading-none">
            <MapPinIcon className="shrink-0 text-[#666666]" />
            <p className="truncate text-base-dark">
              Batch - {courseOffering.batch}
            </p>
          </div>

          {/* <div className="mt-2 flex w-11/12 items-center gap-1 text-xs leading-none">
            <PhoneOutlineIcon className="shrink-0 text-[#666666]" />
            <p className="truncate text-xs text-base-dark">{courseOffering.teacher.id}</p>
          </div> */}
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-4 divide-x divide-[#E7E7E7] px-2 pb-7 text-center">
        <li>
          <Badge
            text={enrollment?.status}
            color={
              enrollment?.status == EnrollmentStatusType.LOCKED
                ? 'bg-yellow-400/10 text-yellow-500'
                : 'bg-accent bg-opacity-10 !text-accent'
            }
            className="capitalize"
          />
        </li>
      </ul>
    </Link>
  );
};

export default CourseCard;
