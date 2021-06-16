import React, { useEffect } from "react"

export const useDocumentTitle = (name: string) => {
  useEffect(() => {
    document.title = name;
    return null
  }, [document])
}
