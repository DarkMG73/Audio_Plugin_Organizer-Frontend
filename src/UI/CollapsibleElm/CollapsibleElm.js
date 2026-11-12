import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import styles from './CollapsibleElm.module.css';

function measureOverflow(body, content) {
  if (!body || !content) return false;
  return (
    content.scrollHeight > body.clientHeight + 2 ||
    content.scrollWidth > body.clientWidth + 2
  );
}

function CollapsibleElm(props) {
  const {
    open: openProp,
    maxHeight,
    styles: contentStyles,
    children,
    alwaysShowToggle = false,
    seeMoreButtonText,
    seeLessButtonText,
    data,
    dataAttribute,
    elmId,
    id,
    className,
    onToggle,
  } = props;

  const [elmOpen, setElmOpen] = useState(Boolean(openProp));
  const [overflowActive, setOverflowActive] = useState(false);
  const bodyRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setElmOpen(Boolean(openProp));
  }, [openProp]);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    const content = contentRef.current;
    if (!body || !content) return undefined;

    const measure = () => {
      setOverflowActive(measureOverflow(body, content));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    observer.observe(content);

    const images = content.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.complete) img.addEventListener('load', measure);
    });

    return () => {
      observer.disconnect();
      images.forEach((img) => img.removeEventListener('load', measure));
    };
  }, [maxHeight, elmOpen]);

  const showToggle = alwaysShowToggle || overflowActive || elmOpen;
  const moreLabel = seeMoreButtonText || 'Show more';
  const lessLabel = seeLessButtonText || 'Show less';

  const handleToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const next = !elmOpen;
    setElmOpen(next);
    if (typeof onToggle === 'function') onToggle(next);
  };

  const bodyStyle = elmOpen
    ? { maxHeight: 'none' }
    : { maxHeight: maxHeight || '12em' };

  return (
    <div
      className={`${styles.collapsible} ${
        elmOpen ? styles.open : styles.closed
      } ${className || ''} collapsible-elm`}
      id={id}
      {...dataAttribute}
    >
      <div className={styles.clip}>
        <div ref={bodyRef} className={styles.body} style={bodyStyle}>
          <div ref={contentRef} className={styles.content} style={contentStyles}>
            {children}
          </div>
        </div>
        {!elmOpen && overflowActive && (
          <div className={styles.fade} aria-hidden="true" />
        )}
      </div>
      {showToggle && (
        <button
          type="button"
          className={styles.toggle}
          data-data={data}
          id={elmId ? `${elmId}-see-more-btn` : undefined}
          aria-expanded={elmOpen}
          onClick={handleToggle}
        >
          <span>{elmOpen ? lessLabel : moreLabel}</span>
          <span className={styles.chevron} aria-hidden="true">
            {elmOpen ? '▴' : '▾'}
          </span>
        </button>
      )}
    </div>
  );
}

export default CollapsibleElm;
