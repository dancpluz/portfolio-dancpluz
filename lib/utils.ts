export const angleToRadians = (angle: number) => {
  return angle * (Math.PI / 180)
}

export function formatDate(startDateString: string, endDateString: string | null = null) {
  const startDate = new Date(startDateString);

  const monthsInPortuguese = [
    'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
    'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
  ];

  const formatSingleDate = (date: Date) => {
    const month = monthsInPortuguese[date.getUTCMonth()];
    const year = date.getUTCFullYear().toString().slice(-2);
    return `${month} ${year}`;
  };

  const startFormatted = formatSingleDate(startDate);

  if (endDateString) {
    const endDate = new Date(endDateString);
    const endFormatted = formatSingleDate(endDate);
    return `${startFormatted} - ${endFormatted}`;
  }

  return `${startFormatted} - ATUAL`;
}

export function formatTimeDifference(startDateString: string, endDateString: string | null = null) {
  const startDate = new Date(startDateString);
  const endDate = endDateString ? new Date(endDateString) : new Date();

  const diffMs = endDate.getTime() - startDate.getTime();

  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));

  if (years > 0) {
    if (months >= 6) {
      return years === 1 ? "1 ANO E MEIO" : `${years} ANOS E MEIO`;
    } else {
      return years === 1 ? "1 ANO" : `${years} ANOS`;
    }
  } else if (months > 0) {
    return months === 1 ? "1 MÊS" : `${months} MESES`;
  } else {
    return "MENOS DE 1 MÊS";
  }
}