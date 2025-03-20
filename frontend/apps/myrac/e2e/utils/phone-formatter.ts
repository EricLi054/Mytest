export const formatPhone = {
  mobile: (number: string): string => {
    return number.length === 10 ? `${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(7)}` : number;
  },

  landline: (number: string): string => {
    if (number.length === 8) {
      return `${number.slice(0, 4)} ${number.slice(4)}`;
    }
    if (number.length === 10) {
      return `${number.slice(0, 2)} ${number.slice(2, 6)} ${number.slice(6)}`;
    }
    return number;
  }
};
