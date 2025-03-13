import { useLayoutEffect, useEffect } from "react";

// Use useLayoutEffect on the client, but fall back to useEffect during SSR
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
