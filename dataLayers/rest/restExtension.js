const RestCollector = require('./restCollector');

class RestExtension {

    willSendResponse(graphqlResponse) {
        let logging = `--------- START_MONITORING_REST ---------\n`;
        logging += `Duration min request: ${RestCollector.minExecutionTimeRequest} ms\n`;
        logging += `Duration max request: ${RestCollector.maxExecutionTimeRequest} ms\n`;
        logging += `Duration total request: ${RestCollector.globalExecutionTimeRequest} ms\n`;
        logging += `Numbers of requests: ${RestCollector.requests.length}\n`;
        logging += `Requests REST: ${JSON.stringify(RestCollector.requests)}\n`;
        logging += `--------- END_MONITORING_REST ---------`;
        console.log(logging);

        RestCollector.reset();

        return graphqlResponse;
    }

    format() {
        return ['rest', {
            minExecutionTimeRequest: RestCollector.minExecutionTimeRequest,
            maxExecutionTimeRequest: RestCollector.maxExecutionTimeRequest,
            globalExecutionTimeRequest: RestCollector.globalExecutionTimeRequest,
            numbersOfRequests: RestCollector.requests.length,
            requests: RestCollector.requests,
        }];
    }
}

module.exports = RestExtension;