import Link from 'next/link';
import { useTranslation } from 'next-i18next';
// hooks
import { useStudentMeQuery } from '@/data/student';
import { useMeQuery, useMyEnrollmentsPaginatedQuery } from '@/data/user';
// components
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge/badge';
import Loader from '@/components/ui/loader/loader';
import { AvatarIcon } from '@/components/icons/avatar-icon';
import { BookOpenIcon } from '@/components/icons/summary/book-open';
import { DegreeHatIcon } from '@/components/icons/summary/degree-hat';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: string;
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
  color = 'bg-accent/10',
}: QuickActionCardProps) {
  return (
    <div
      className="flex h-full w-full flex-col rounded-lg border border-b-4 border-border-200 bg-light p-5 md:p-6"
      style={{ borderBottomColor: color }}
    >
      <div className="flex items-start gap-4">
        <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-heading">{title}</h4>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          <Link href={href}>
            <Button
              className="mt-3 text-sm font-medium"
              variant="outline"
              size="small"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { t } = useTranslation();
  const { data } = useMeQuery();
  // query
  const { data: studentMeData, isLoading: studentDetailsLoading } =
    useStudentMeQuery();
  const { loading } = useMyEnrollmentsPaginatedQuery({});

  if (loading || studentDetailsLoading)
    return <Loader text={t('common:text-loading')} />;

  // Format date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const quickActions = [
    {
      title: 'Module Enrollment',
      description: 'Select and manage your modules for the current semester',
      icon: <BookOpenIcon className="h-6 w-6 text-accent" />,
      href: '/my-courses',
      color: '#D74EFF',
    },
    {
      title: 'My Profile',
      description:
        'Update your personal information, contact details, and account settings',
      icon: <AvatarIcon className="h-6 w-6 text-accent" />,
      href: '/profile-update',
      color: '#1EAE98',
    },
    {
      title: 'Exam Results',
      description:
        'Check your exam results, grades, GPA, and academic performance history',
      icon: <DegreeHatIcon className="h-6 w-6 text-accent" />,
      href: '/',
      color: '#865DFF',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
        {/* Welcome Section */}
        <div className="rounded-lg bg-gradient-to-r from-accent/10 to-accent/10 p-6 md:p-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {/* <h1 className="text-lg font-bold text-heading md:text-3xl">
                Welcome back!
              </h1> */}
              {/* <p className="mt-1 text-lg font-medium text-gray-700">
                {data?.full_name || 'Hello Student'}
              </p> */}
              <p className="text-lg font-medium text-gray-700">Welcome back!</p>
              <h1 className="text-lg mb-2 font-bold text-heading md:text-3xl capitalize">
                {data?.full_name || 'Hello Student'}
              </h1>
              <p className="text-md text-gray-500">
                <Badge
                  text={studentMeData?.student_number}
                  color="bg-accent/10 !text-accent"
                />
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <p className="text-sm font-medium text-gray-600">
                {formattedDate}
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Your central hub for managing academic activities, tracking
            progress, and accessing essential student services.
          </p>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-heading">Quick Actions</h3>
          <p className="mb-5 text-sm text-gray-500">
            Access your most-used features
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.title}
                title={action.title}
                description={action.description}
                icon={action.icon}
                href={action.href}
                color={action.color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
