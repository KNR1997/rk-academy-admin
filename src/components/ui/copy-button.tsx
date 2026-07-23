import { CopyIcon } from '@/components/icons/copy';

export const CopyButton = ({
  onClick,
  title,
}: {
  onClick: () => void;
  title: string;
}) => (
  <button
    className="absolute top-[27px] right-px z-0 flex h-[46px] w-11 items-center justify-center rounded-tr rounded-br border-l border-solid border-border-base bg-white px-2 text-body transition duration-200 hover:text-heading focus:outline-none"
    type="button"
    title={title}
    onClick={onClick}
  >
    <CopyIcon width={16} />
  </button>
);
