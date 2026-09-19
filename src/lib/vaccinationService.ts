
export const calculateNextDueDate = (vaccineName: string, lastDateStr: string, species: string): string | null => {
  const lastDate = new Date(lastDateStr);
  if (isNaN(lastDate.getTime())) return null;

  let monthsToAdd = 12; // Default to 1 year

  const name = vaccineName.toLowerCase();
  
  // Veterinary intervals based on species and vaccine type
  if (species === 'Dog') {
    if (name.includes('rabies')) monthsToAdd = 36;
    else if (name.includes('dhpp') || name.includes('distemper') || name.includes('parvo')) monthsToAdd = 36;
    else if (name.includes('bordetella')) monthsToAdd = 12;
    else if (name.includes('leptospirosis') || name.includes('lepto')) monthsToAdd = 12;
    else if (name.includes('influenza')) monthsToAdd = 12;
    else if (name.includes('lyme')) monthsToAdd = 12;
  } else if (species === 'Cat') {
    if (name.includes('rabies')) monthsToAdd = 12; // Often annual for feline purevax
    else if (name.includes('fvrcp')) monthsToAdd = 36;
    else if (name.includes('felv') || name.includes('leukemia')) monthsToAdd = 12;
  }

  const nextDate = new Date(lastDate);
  nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
  
  return nextDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: '2-digit' 
  });
};
