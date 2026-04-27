export const useQuoteModal = () => {
  const isOpen = useState('quoteModal', () => false);

  const open = () => {
    isOpen.value = true;
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    isOpen.value = false;
    document.body.style.overflow = '';
  };

  return { isOpen, open, close };
};
