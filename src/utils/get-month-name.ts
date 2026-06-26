export const getMonthNameFromArray = (monthNumber: number) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Subtract 1 to match 0-based array indexing
  return months[monthNumber - 1];
};
