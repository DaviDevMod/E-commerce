import { useEffect, useRef, useState } from "react";

// to simplify the hook logic, in case you are trapping the focus within an element containing a group of focusable
// elements identified as a single entity (like a group of radio buttons) you must ensure that within the container
// there is at least one focusable element both before and after the group (you can help yourself with tabindex='0')
const focusable = 'a, button, input, textarea, select, details, [tabindex]:not([tabindex^="-"])';

// the hook expects the HTML "id" attribute of the DOM element in which to trap the focus and
// returns a setter function expecting a reference to a button that when clicked unmounts the
// component that called the hook (you can conveniently use the setter as a callback ref)

// NB: if you do not unmont the hook, it may keep listening for changes in the DOM; also if
// used inproperly, the hook can trap the user forever (be sure to provide the right id and untrapRef)
function useTrapFocus(nodeId = 'overlays') {

  const node = useRef();
  const [nodeUpdate, setNodeUpdate] = useState(false);
  const [firstRef, setFirstRef] = useState(null);
  const [lastRef, setLastRef] = useState(null);
  const [untrapRef, setUntrapRef] = useState(null);

  useEffect(() => {
    node.current = document.getElementById(nodeId);
    if (node.current instanceof HTMLElement) {
      const observer = new MutationObserver(() => setNodeUpdate(state => !state));
      observer.observe(node.current, { childList: true });
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    const focusableInNode = node.current instanceof HTMLElement && node.current.querySelectorAll(focusable);
    if (focusableInNode) {
      setFirstRef(focusableInNode[0]);
      setLastRef(focusableInNode[focusableInNode.length - 1]);
    }
  }, [nodeUpdate]);

  useEffect(() => {
    if (untrapRef instanceof HTMLElement) {
      untrapRef.focus();
      if (firstRef && lastRef) {
        const tabNavigationHandler = event => {
          if (event.key === 'Tab' || event.keyCode === 9) {
            event.shiftKey ?
              document.activeElement === firstRef && (lastRef.focus(), event.preventDefault()) :
              document.activeElement === lastRef && (firstRef.focus(), event.preventDefault());
          }
        };
        document.addEventListener('keydown', tabNavigationHandler);
        return () => document.removeEventListener('keydown', tabNavigationHandler);
      }
    }
  }, [firstRef, lastRef, untrapRef]);

  return setUntrapRef;
}

export default useTrapFocus;