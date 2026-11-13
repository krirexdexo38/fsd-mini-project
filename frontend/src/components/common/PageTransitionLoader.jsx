import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Loader from '../kokonutui/loader';

export default function PageTransitionLoader() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Quick initial landing splash loader only
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isInitialLoad && (
        <motion.div
          key="initial-page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background transition-colors"
          style={{ pointerEvents: 'none' }}
        >
          <div className="relative z-10 flex flex-col items-center justify-center">
            <Loader
              size="md"
              title="CampusHub"
              subtitle="Loading campus platform..."
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
