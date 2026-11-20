import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal, flushSync } from "react-dom";
import { AppLayer } from "../../providers/AppLayer/AppLayer";
import "./Modal.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  transitionSourceRef?: RefObject<HTMLElement | null>;
}

const TRANSITION_NAME_PROPERTY = "view-transition-name";
const VISIBILITY_PROPERTY = "visibility";

type SourceStyles = {
  visibility: string;
  viewTransitionName: string;
};

type PendingTransition = {
  transition: ViewTransition | null;
  generation: number;
  targetOpen: boolean;
  applied: boolean;
};

const setStyle = (element: HTMLElement, property: string, value: string) => {
  if (value) {
    element.style.setProperty(property, value);
  } else {
    element.style.removeProperty(property);
  }
};

export const Modal = ({
  isOpen,
  onClose,
  children,
  transitionSourceRef,
}: ModalProps) => {
  const id = useId();
  const transitionName = `modal-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [renderedOpen, setRenderedOpen] = useState(isOpen);
  const sourceElementRef = useRef<HTMLElement | null>(null);
  const sourceStylesRef = useRef<SourceStyles | null>(null);
  const pendingTransitionRef = useRef<PendingTransition | null>(null);
  const generationRef = useRef(0);

  const restoreTransitionSource = useCallback(() => {
    const source = sourceElementRef.current;
    const styles = sourceStylesRef.current;

    if (source && styles) {
      setStyle(source, VISIBILITY_PROPERTY, styles.visibility);
      setStyle(source, TRANSITION_NAME_PROPERTY, styles.viewTransitionName);
    }

    sourceElementRef.current = null;
    sourceStylesRef.current = null;
  }, []);

  // Keep the rendered state one step behind `isOpen` and commit it inside the
  // view transition callback, so the browser captures the correct old and new
  // states with the source element's transition name moved between them.
  useEffect(() => {
    const pending = pendingTransitionRef.current;

    if (isOpen === renderedOpen) {
      // A transition for the opposite state may still be waiting for its
      // callback. Cancel it and put the source back in sync with what is
      // actually rendered.
      if (pending && !pending.applied && pending.targetOpen !== isOpen) {
        generationRef.current += 1;
        pendingTransitionRef.current = null;
        pending.transition?.skipTransition();

        if (renderedOpen) {
          sourceElementRef.current?.style.setProperty(
            VISIBILITY_PROPERTY,
            "hidden",
          );
          sourceElementRef.current?.style.removeProperty(
            TRANSITION_NAME_PROPERTY,
          );
        } else {
          restoreTransitionSource();
        }
      }

      // A modal mounted already open has no transition to play, but its
      // source should stay hidden until the modal closes. Re-checking here
      // also keeps StrictMode's effect replay consistent.
      if (
        isOpen &&
        transitionSourceRef?.current &&
        !sourceElementRef.current
      ) {
        const source = transitionSourceRef.current;

        sourceElementRef.current = source;
        sourceStylesRef.current = {
          visibility: source.style.visibility,
          viewTransitionName: source.style.viewTransitionName,
        };
        source.style.setProperty(VISIBILITY_PROPERTY, "hidden");
        source.style.removeProperty(TRANSITION_NAME_PROPERTY);
      }

      return;
    }

    // The requested state is already being transitioned to; let it finish.
    if (pending && !pending.applied && pending.targetOpen === isOpen) {
      return;
    }

    if (pending) {
      generationRef.current += 1;
      pendingTransitionRef.current = null;
      pending.transition?.skipTransition();

      // If the callback had not run yet, the DOM is still at the previous
      // rendered state. Put the staged source back before starting over.
      if (!pending.applied) {
        if (renderedOpen) {
          sourceElementRef.current?.style.setProperty(
            VISIBILITY_PROPERTY,
            "hidden",
          );
          sourceElementRef.current?.style.removeProperty(
            TRANSITION_NAME_PROPERTY,
          );
        } else {
          restoreTransitionSource();
        }
      }
    }

    const generation = ++generationRef.current;

    if (isOpen) {
      const requestedSource = transitionSourceRef?.current ?? null;

      if (
        sourceElementRef.current &&
        sourceElementRef.current !== requestedSource
      ) {
        restoreTransitionSource();
      }

      if (requestedSource && !sourceElementRef.current) {
        sourceElementRef.current = requestedSource;
        sourceStylesRef.current = {
          visibility: requestedSource.style.visibility,
          viewTransitionName: requestedSource.style.viewTransitionName,
        };
      }

      // The source must be named before the old snapshot is taken so the
      // modal has an element to morph from.
      sourceElementRef.current?.style.setProperty(
        TRANSITION_NAME_PROPERTY,
        transitionName,
      );
    }

    const source = sourceElementRef.current;

    const applyState = (sync: boolean) => {
      if (generationRef.current !== generation) return;

      if (source) {
        if (isOpen) {
          source.style.setProperty(VISIBILITY_PROPERTY, "hidden");
          source.style.removeProperty(TRANSITION_NAME_PROPERTY);
        } else {
          source.style.setProperty(TRANSITION_NAME_PROPERTY, transitionName);
          setStyle(
            source,
            VISIBILITY_PROPERTY,
            sourceStylesRef.current?.visibility ?? "",
          );
        }
      }

      if (sync) {
        flushSync(() => setRenderedOpen(isOpen));
      } else {
        setRenderedOpen(isOpen);
      }
    };

    const finish = (applied: boolean) => {
      if (pendingTransitionRef.current?.generation === generation) {
        pendingTransitionRef.current = null;
      }

      if (generationRef.current !== generation) return;

      if (!applied) {
        applyState(false);
      }

      if (!isOpen) {
        restoreTransitionSource();
      }
    };

    if (typeof document.startViewTransition !== "function") {
      applyState(false);
      finish(true);
      return;
    }

    const pendingTransition: PendingTransition = {
      transition: null,
      generation,
      targetOpen: isOpen,
      applied: false,
    };
    pendingTransitionRef.current = pendingTransition;

    const transition = (() => {
      try {
        return document.startViewTransition(() => {
          if (generationRef.current !== generation) return;

          pendingTransition.applied = true;
          applyState(true);
        });
      } catch {
        // Treat a failed start like a browser without view transitions.
        applyState(false);
        finish(true);
        return null;
      }
    })();

    if (!transition) return;

    pendingTransition.transition = transition;

    // A transition that is replaced or skipped rejects `ready`; consume it so
    // the browser does not report an unhandled rejection.
    transition.ready.catch(() => {});

    transition.finished
      .catch(() => {
        // Superseded or interrupted transitions reject. The state is
        // reconciled below, or by the transition that replaced this one.
      })
      .finally(() => {
        finish(pendingTransition.applied);
      });
  }, [
    isOpen,
    renderedOpen,
    transitionSourceRef,
    transitionName,
    restoreTransitionSource,
  ]);

  useEffect(() => {
    return () => {
      generationRef.current += 1;

      const pending = pendingTransitionRef.current;
      pendingTransitionRef.current = null;
      pending?.transition?.skipTransition();

      restoreTransitionSource();
    };
  }, [restoreTransitionSource]);

  if (!renderedOpen) return null;

  return createPortal(
    <AppLayer
      onClose={onClose}
      closeOnEscape
      blockBottomLayers
      onClick={onClose}
      className="modal-layer"
    >
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          viewTransitionName: transitionName,
        }}
      >
        {children}
      </div>
    </AppLayer>,
    document.getElementById("theme-provider")!,
  );
};

type modalSectionProps = {
  children: ReactNode;
};

Modal.Title = ({ children }: modalSectionProps) => {
  return <div className="modal-header">{children}</div>;
};

Modal.HelpText = ({ children }: modalSectionProps) => {
  return <div className="modal-help-text">{children}</div>;
};

Modal.Body = ({ children }: modalSectionProps) => {
  return <div className="modal-body">{children}</div>;
};

Modal.Actions = ({ children }: modalSectionProps) => {
  return <div className="modal-actions">{children}</div>;
};
