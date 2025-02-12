export interface RequestLike {
  headers: { [key: string]: string}
}

export interface UserInfo {
  id?: string;
  name?: string;
  bio?: string;
  url?: string;
  profileImage?: string;
  roles?: Array<string>;
  teams?: Array<string>;
}

//remove header prefix and convert to camel case
//doesn't affect the value
function cleanHeader(headerName: string): string {
  return headerName.replace("x-replit-user-", "").replace(/-(.)/g, function(_, group1) {
    return group1.toUpperCase();
  })
}

/**
* Gets all user info. Returns a UserInfo object if the user is logged in.
*/
export const getUserInfo = (request: RequestLike): UserInfo | null => {
  const { headers } = request
  const userInfo: { [key: string]: string | string[] } = {}

  for (const headerName of Object.keys(headers)) {
    const headerValue = headers[headerName]
    if (headerName.startsWith("x-replit-") && headerValue && typeof headerValue === 'string') {
      const cleanHeaderName = cleanHeader(headerName)

      //check if property is meant to be an array
      if (cleanHeaderName === 'roles' || cleanHeaderName === 'teams') {
        userInfo[cleanHeaderName] = (headerValue).split(',')
      } else {
        userInfo[cleanHeaderName] = headerValue
      }
    }
  }

  //check if userInfo is empty
  if (Object.keys(userInfo).length === 0 && userInfo.constructor === Object) {
    return null
  }
  return userInfo
}