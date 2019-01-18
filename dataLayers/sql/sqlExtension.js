const SQLCollector = require('./sqlCollector');

class SQLGraphQLExtension {

    willSendResponse(graphqlResponse) {
        const { executionTime, queries } = SQLCollector;

        let logging = `--------- START MONITORING_SQL ---------\n`;
        logging += `Duration: ${executionTime} ms\n`;
        logging += `Numbers of queries: ${queries.length}\n`;
        logging += `Queries SQL: ${JSON.stringify(queries)}\n`;
        logging += `--------- END MONITORING_SQL ---------`;
        console.log(logging);

        SQLCollector.reset();

        return graphqlResponse;
    }

    format() {
        return ['sql', {
            executionTime: SQLCollector.executionTime,
            numbersOfQueries: SQLCollector.queries.length,
            queries: SQLCollector.queries,
        }];
    }
}

module.exports = SQLGraphQLExtension;