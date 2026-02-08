const RoleColor = (role: string) => {
  let bg_class = '';
  const normalizedRole = role?.toLowerCase() || '';

  if (normalizedRole === 'admin') {
    bg_class = 'bg-rose-400 bg-opacity-10 text-rose-500';
  } else if (normalizedRole === 'teacher') {
    bg_class = 'bg-blue-400 bg-opacity-10 text-blue-500';
  } else if (normalizedRole === 'student') {
    bg_class = 'bg-emerald-400 bg-opacity-10 text-emerald-500';
  } else {
    bg_class = 'bg-gray-400 bg-opacity-10 text-gray-500';
  }
  return bg_class;
};

export default RoleColor;
