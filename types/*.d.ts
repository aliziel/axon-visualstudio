
interface UrlProp{
  raw:string,
  host:string[],
  port:string,
  path?:string[],
}

interface RequestProp{
  method: string,
	header: string[],
	url: UrlProp,
}

interface RequestObject{
  name: string,
  request: RequestProp,
	response: string[],
}

interface PostmanInfo{
  name: string,
  schema: string,
}

interface PostmanEventScript{
  type: string,
  exec: string[],
}

interface PostmanEvent{
  listen: string,
  script: PostmanEventScript,
}

interface PostmanVariable{
  key:string,
  value:string,
}

interface PostmanCollection{
  info: PostmanInfo,
  item: RequestObject[],
  event: PostmanEvent[],
  variable: PostmanVariable[],
	  
}

interface RoutersObject{
  [key:string]:string[]
}

type Endpoint = string | TestParams;

interface EndpointArray{
  [index:number]:Endpoint[]
}

interface EndpointObject{
  [key:string]:EndpointArray
}

interface ImportObject{
  [key:string]:string
}

interface FileObject{
  name?: string,
  imports?: Partial<ImportObject>,
  endpoints?: Partial<EndpointObject>,
  routers?:Partial<RoutersObject>,
  text?:string,
}

interface PathObject{
  [key:string]: FileObject | string,
}

interface TestParams{
  status?:string,
  'content-type'?:string,
}

interface ReadResult{
  name:string,
  text:string,
}

interface REMatch{
  [key:number]:ImportObject
}

interface StringConfiguration {
  autoNewLine?: boolean,
  autoSpacing?: boolean,
  indentationAmount?: number
}

interface EndpointInformation {
  statusCode?: number | string,
  route?: string,
  contentType?: string
}

