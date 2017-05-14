import * as https from 'https';
import * as url from 'url';
import fetch from 'node-fetch';
import urljoin from 'url-join';

const sslfree = new https.Agent({rejectUnauthorized: false});

/**
 * Rest API wrapper.
 */
class RestWrapper {

  /**
   * Default constructor.
   *
   * @param   String baseUrl Base URL without trailing slash
   * @param   Object opts    Options
   * @return  Void
   */
  constructor(baseUrl, {
    ignoreCertifcate = true,
    headers = {}
  }) {
    this.baseUrl = baseUrl;
    this.agent = baseUrl && baseUrl.startsWith('https') && ignoreCertifcate
      ? sslfree
      : null;
    this.headers = headers;
  }

  /**
   * Construct endpoint based on baseUrl and given api(relative path).
   *
   * @param  String api relative path point to the API
   * @return Promise to get TicketType
   */
  buildEndpoint(api) {
    return urljoin(this.baseUrl, api);
  }

  /**
   * Invoke specific rest API.
   *
   * @param  String api    relative path(starts with slash) to base URL
   * @param  String method HTTP method, defaults to GET
   * @return Promise to get TicketType
   */
  call(api, method = 'GET', data = {}) {
    return fetch(this.buildEndpoint(api), {
      method: method,
      headers: this.headers,
      agent: this.agent,
      body: JSON.stringify(data)
    });
  }
}

export {RestWrapper};
