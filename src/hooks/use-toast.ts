
import { useEffect, useState } from "react"

type ToastType = "default" | "destructive"

type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  type?: ToastType
}

type ToasterToast = Omit<Toast, "id"> & {
  id?: string
}

type ToastAction = {
  type: "ADD_TOAST"
  toast: ToasterToast
} | {
  type: "UPDATE_TOAST"
  toast: Partial<ToasterToast> & { id: string }
} | {
  type: "DISMISS_TOAST"
  toastId?: string
}

let memoryState: { toasts: Toast[] } = { toasts: [] }

const listeners: Array<(state: { toasts: Toast[] }) => void> = []

const toast = (toast: ToasterToast) => {
  dispatch({ type: "ADD_TOAST", toast })
}

const dispatch = (action: ToastAction) => {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

const reducer = (state: { toasts: Toast[] }, action: ToastAction): { toasts: Toast[] } => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [{ ...action.toast, id: action.toast.id || String(Date.now()) }, ...state.toasts],
      }
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default:
      return state
  }
}

function useToast() {
  const [state, setState] = useState(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
