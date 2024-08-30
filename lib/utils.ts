export const angleToRadians = (angle: number) => {
  return angle * (Math.PI / 180)
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  const months = [
    'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
    'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'
  ];

  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear().toString().slice(-2);

  return `${month} ${year}`;
}

export function formatTimeDifference(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();

  const diffMs = today - inputDate;

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