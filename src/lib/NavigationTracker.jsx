import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function NavigationTracker() {
  const location = useLocation();
  useEffect(() => {
    // Track page views here if needed (e.g. analytics)
  }, [location]);
  return null;
}
