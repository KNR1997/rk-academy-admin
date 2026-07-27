import cn from 'classnames';
import { CopyIcon } from '@/components/icons/copy';

export const CopyButton = ({
  onClick,
  title,
  className = '',
}: {
  onClick: () => void;
  title: string;
  className?: string;
}) => (
  <button
    className={cn(
      'absolute top-[27px] right-px z-0 flex h-[46px] w-11 items-center justify-center rounded-tr rounded-br border-l border-solid border-border-base bg-white px-2 text-body transition duration-200 hover:text-heading focus:outline-none',
      className,
    )}
    // className="absolute top-[27px] right-px z-0 flex h-[46px] w-11 items-center justify-center rounded-tr rounded-br border-l border-solid border-border-base bg-white px-2 text-body transition duration-200 hover:text-heading focus:outline-none"
    type="button"
    title={title}
    onClick={onClick}
  >
    <CopyIcon width={20} />
  </button>
);
