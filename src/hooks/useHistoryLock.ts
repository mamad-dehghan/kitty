import { useEffect, useId, useState } from "react";

export const lockBackList: Map<string, (() => void)> = new Map()

export const useHistoryLock = (releaseCallback: () => void, forceLock?: boolean) => {
  const [isLock, setLock] = useState(false)
  const id = useId();

  useEffect(() => {
    if (isLock) {
      lockBackList.set(id, releaseCallback)
      history.pushState({ layer: lockBackList.size }, "");
    }
    return () => {
      if (isLock) {
        lockBackList.delete(id)
        if (lockBackList.size < (+history.state?.layer || 0))
          history.back()
      }
    }
  }, [id, isLock])

  useEffect(() => {
    if (lockBackList.has(id))
      lockBackList.set(id, releaseCallback)
  }, [releaseCallback])

  useEffect(() => {
    if (forceLock !== undefined)
      setLock(forceLock)
  }, [forceLock])

  return {
    lock: () => {
      setLock(true)
    },
    unlock: () => {
      setLock(false)
    }
  }
}

export const releaseLastHistoryLock = () => {
  const lastActivatedItem = lockBackList.keys().toArray().at(-1)
  if (lastActivatedItem === undefined) return false;
  const releaseCallback = lockBackList.get(lastActivatedItem)
  if (releaseCallback === undefined) return false;
  lockBackList.delete(lastActivatedItem)
  releaseCallback();
}

export const releaseHistoryLock = (id: string) => {
  const releaseCallback = lockBackList.get(id)
  if (releaseCallback === undefined) return false;

  lockBackList.delete(id)
  releaseCallback();
}

export const onPopStateChange = () => {
  const blockCounts = lockBackList.size
  const state = (+history.state?.layer || 0);

  if (blockCounts > state)
    releaseLastHistoryLock()
  else if (blockCounts < state) history.back()
}

export const useHistoryLockAbility = () => {
  useEffect(() => {
    window.addEventListener("popstate", onPopStateChange)
    return () => {
      window.removeEventListener("popstate", onPopStateChange);
    }
  }, [])
}
