const { RESTDataSource: BaseRESTDataSource } = require('apollo-datasource-rest');
const RestCollector = require('../restCollector');

class RESTDataSource extends BaseRESTDataSource {

    willSendRequest(request) {
        const startTime = process.hrtime();
        this.currentRequest = { request, startTime };
    }

    async didReceiveResponse(response, _request) {
        const { startTime, request } = this.currentRequest;
        const hrend = process.hrtime(startTime);

        RestCollector.addRequest({
            executionTime: hrend[1] / 1000000,
            request: {
                url: response.url,
                method: request.method,
                params: request.params,
            }
        });

        return super.didReceiveResponse(response, _request);
    }
}

module.exports = RESTDataSource;