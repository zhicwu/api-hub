import {pentahoWrapper} from './lib';

const defaultPentahoApi = pentahoWrapper("http://localhost:8080/pentaho");

// The root provides the top-level API endpoints
let root = {
    jobs: function ({}) {
        return defaultPentahoApi.scheduledJobs();
    }
}

export default root;