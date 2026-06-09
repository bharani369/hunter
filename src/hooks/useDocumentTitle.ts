import { useEffect } from 'react';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const baseTitle = "Hunter Mens & Juniors Namakkal | Men's Fashion Store Tamil Nadu";
    if (title) {
      document.title = `${title} | Hunter Mens & Juniors`;
    } else {
      document.title = baseTitle;
    }
  }, [title]);
}
