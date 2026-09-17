import { useApp } from '../context/AppContext';

export const usePetSwitcher = () => {
  const { householdData, updateHousehold } = useApp() as any;

  const setActivePet = (petId: string) => {
    if (updateHousehold) {
      updateHousehold((prev: any) => ({ ...prev, activePetId: petId }));
    }
  };

  return {
    activePetId: householdData?.activePetId || '',
    setActivePet,
    pets: Object.values(householdData?.pets || {})
  };
};
