import { HttpResponse } from '@interfaces/http'
import { Injectable } from '@nestjs/common'
import axios from 'axios'
import _ from 'lodash'
import { GenericObject } from '@interfaces/generic'

@Injectable()
export class HTTPService {
  private static instance: HTTPService

  private constructor() {}

  static getInstance(): HTTPService {
    if (_.isNil(HTTPService.instance)) {
      HTTPService.instance = new HTTPService()
    }
    return HTTPService.instance
  }

  public get(url: string, params?: GenericObject, headers?: any) {
    return new Promise<HttpResponse>((resolve: (value?: HttpResponse | PromiseLike<HttpResponse>) => void, reject: (reason?: Error) => void) => {
      axios
        .get(url, {
          headers,
          params,
          paramsSerializer: (params) => {
            let result = ''
            Object.keys(params).forEach((key) => {
              result += `${key}=${encodeURIComponent(params[key])}&`
            })
            return result.substr(0, result.length - 1)
          },
        })
        .then((response: HttpResponse) => {
          resolve(response)
        })
        .catch((error: Error) => {
          reject(error)
        })
    })
  }

  public post(url: string, data?: any, params?: any, headers?: any) {
    return new Promise<HttpResponse>((resolve: (value?: HttpResponse | PromiseLike<HttpResponse>) => void, reject: (reason?: Error) => void) => {
      axios
        .post(url, data, { headers, params })
        .then((response: HttpResponse) => {
          resolve(response)
        })
        .catch((error: Error) => {
          reject(error)
        })
    })
  }
}
