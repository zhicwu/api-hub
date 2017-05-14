import {RestWrapper} from './rest';

const DEFAULT_HTTP_METHOD = 'GET';
const API_GET_SCHEDULED_JOBS = '/api/scheduler/jobs';

class PentahoJobParameterType {
  constructor({name, value}) {
    this.name = name;
    this.value = value;
  }
}

class PentahoJobTriggerType {
  constructor(type, {startTime}) {
    this.type = type;
    this.startTime = startTime;
  }
}

class PentahoScheduledJobType {
  constructor({
    server,
    duration
  }, {
    groupName,
    jobId,
    jobName,
    lastRun,
    nextRun,
    state,
    userName,
    jobParams,
    jobTrigger
  }) {
    this.server = server;
    this.duration = duration;

    this.group = groupName;
    this.id = jobId;
    this.name = jobName;
    this.lastRun = lastRun;
    this.nextRun = nextRun;
    this.state = state;
    this.user = userName;

    this.parameters = jobParams
      ? jobParams
        .jobParams
        .map(p => new PentahoJobParameterType(p))
      : [];
    this.trigger = new PentahoJobTriggerType(jobTrigger['@type'], jobTrigger);
  }
}

class PentahoWrapper extends RestWrapper {
  // override default constructor
  constructor(pentahoServer, {
    username = 'admin',
    password = 'password',
    ignoreCertifcate = true,
    headers = {
      'Content-Type': 'application/json'
    }
  }) {
    super(pentahoServer, ignoreCertifcate, headers);
    Object.assign(this.headers, {
      'Authorization': `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`
    });
  }

  scheduledJobs() {
    const startTime = new Date().getTime();

    return this
      .call(API_GET_SCHEDULED_JOBS)
      .then(res => {
        return res.json();
      })
      .then(json => {
        let jobs = json.job;
        return jobs.map(job => new PentahoScheduledJobType({
          server: this.baseUrl,
          duration: new Date().getTime() - startTime
        }, job));
      });
  }
}

const pentahoWrapper = function ({
  pentahoServer = 'http://localhost:8080/pentaho',
  username = 'admin',
  password = 'password',
  ignoreCertificate = true
}) {
  return new PentahoWrapper(pentahoServer, {
    username: username,
    password: password,
    ignoreCertificate: ignoreCertificate
  });
};

export {pentahoWrapper};
