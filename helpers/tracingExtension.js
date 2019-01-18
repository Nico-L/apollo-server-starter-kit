const { TracingExtension: BaseTracingExtension } = require("apollo-tracing");

class TracingExtension extends BaseTracingExtension {

  requestDidStart(...args) {
    this.startTime = new process.hrtime();
    return super.requestDidStart(...args);
  }

  format() {
    const [name, tracing] = super.format();
    const hrend = process.hrtime(this.startTime);
    const executionTime = hrend[1] / 1000000;

    let logging = `--------- START_MONITORING_GRAPHQL ---------\n`;
    logging += `Duration resolvers: ${tracing.duration / 1000000} ms\n`;
    logging += `Duration total: ${executionTime} ms\n`;
    logging += `--------- END_MONITORING_GRAPHQL ---------`;
    console.log(logging);

    return [name, tracing];
  }
}

module.exports = TracingExtension;