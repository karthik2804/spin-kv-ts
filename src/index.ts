import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {

  let store = spinSdk.kv.openDefault()
  let status = 200
  let body

  switch (request.method) {
    case "POST":
      store.set(request.uri, request.body || (new Uint8Array()).buffer)
      break;
    case "GET":
      let val
      try {
        val = store.get(request.uri)
        body = decoder.decode(val)
      } catch (error) {
        status = 404
      }
      break;
    case "DELETE":
      store.delete(request.uri)
      break;
    case "HEAD":
      if (!store.exists(request.uri)) {
        status = 404
      }
      break;
    default:
  }

  return {
    status: status,
    body: body
  }
}
