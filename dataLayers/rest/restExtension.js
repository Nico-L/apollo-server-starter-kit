const RestCollector = require('./restCollector');

class RestExtension {

    willSendResponse(graphqlResponse) {
        const { executionTime, requests } = RestCollector;

        let logging = `--------- START_MONITORING_REST ---------\n`;
        logging += `Duration: ${executionTime} ms\n`;
        logging += `Numbers of requests: ${requests.length}\n`;
        logging += `Requests REST: ${JSON.stringify(requests)}\n`;
        logging += `--------- END_MONITORING_REST ---------`;
        console.log(logging);

        RestCollector.reset();

        return graphqlResponse;
    }

    format() {
        return ['rest', {
            executionTime: RestCollector.executionTime,
            numbersOfRequests: RestCollector.requests.length,
            requests: RestCollector.requests,
        }];
    }
}

module.exports = RestExtension;