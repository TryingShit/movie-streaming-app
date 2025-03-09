import { useEffect, useRef } from 'react';

/**
 * Custom hook to handle iframe ad blocking and prevent redirects
 * @param iframeRef Reference to the iframe element
 */
export function useAdBlocker(iframeRef: React.RefObject<HTMLIFrameElement>) {
  const popupCount = useRef(0);
  
  useEffect(() => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    
    // Function to block popup attempts
    const blockPopups = () => {
      popupCount.current += 1;
      console.log(`Blocked popup attempt #${popupCount.current}`);
      return false;
    };

    // Store the original window.open function
    const originalWindowOpen = window.open;
    
    // Override window.open to prevent popups
    window.open = function() {
      return blockPopups() as any;
    };
    
    // Add event listeners to prevent navigation redirects
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only prevent if it seems to be an ad redirect
      if (popupCount.current > 0) {
        e.preventDefault();
        return (e.returnValue = '');
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Try to add a load event to the iframe to block redirects within the iframe
    iframe.addEventListener('load', () => {
      try {
        // Access iframe content (may be restricted due to same-origin policy)
        const iframeWindow = iframe.contentWindow;
        if (iframeWindow) {
          // Override potential redirect methods
          iframeWindow.open = blockPopups as any;
        }
      } catch (error) {
        // Cannot access iframe content due to same-origin policy
        console.log("Cannot access iframe content due to same-origin policy");
      }
    });
    
    // Cleanup function
    return () => {
      window.open = originalWindowOpen;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [iframeRef]);
}