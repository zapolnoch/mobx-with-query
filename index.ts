import { makeAutoObservable, onBecomeObserved } from "mobx"

export class WithQuery<TData, TResult = TData> {
  constructor(
    private method: (...args: any) => Promise<TData>,
    private config?: {
      loadOnMount?: boolean
      onError?: () => void
      onSuccess?: (data: TData) => void
      transform?: (data: TData) => TResult
    },
  ) {
    makeAutoObservable(this)
    this.config = { loadOnMount: true, ...this.config }
    if (this.config.loadOnMount) onBecomeObserved(this, "data", this.load)
  }

  isLoading?: boolean
  started = false
  state: "fulfilled" | "pending" | "rejected" = "pending"
  data?: TResult = undefined
  error?: unknown

  load = async (...args: any) => {
    try {
      this.started = true
      this.isLoading = true

      const result = await this.method(args)
      this.data = this.config?.transform
        ? this.config.transform(result)
        : (result as TResult)

      this.state = "fulfilled"
      this.config?.onSuccess?.(result)
    } catch (error) {
      this.error = error
      this.state = "rejected"
      this.config?.onError?.()
    } finally {
      this.isLoading = false
      return this.data as TData
    }
  }
}
