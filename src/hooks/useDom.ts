import React, { useEffect } from "react"

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
    return null
  }, [document])
}
