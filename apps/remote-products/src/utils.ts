import { toaster } from "./components/Toaster"

const showToastr = (type: 'success' | 'error' | 'warning', message: string) => {
    toaster.create({
      type,
      title: message,
      closable: true,
      duration: 3500,
    })
  }

export { showToastr }