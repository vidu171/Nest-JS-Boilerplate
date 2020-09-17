export interface HttpResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  request?: any
}

export interface HttpRequest<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  request?: any
}
