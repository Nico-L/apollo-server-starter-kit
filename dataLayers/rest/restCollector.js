class RestCollector {
  constructor() {
    this._initializeData();
  }

  _initializeData() {
    this.executionTime = 0;
    this.maxExecutionTime = null;
    this.minExecutionTime = null;
    this.requests = [];
  }

  reset() {
    this._initializeData();
  }

  addRequest({ executionTime, request }) {
    if (!this.maxExecutionTime || executionTime > this.maxExecutionTime) {
      this.maxExecutionTime = executionTime;
    }
    if (!this.minExecutionTime || executionTime < this.minExecutionTime) {
      this.minExecutionTime = executionTime;
    }
    this.executionTime += executionTime;
    this.requests.push({
      executionTime: `${executionTime} ms`,
      request
    });

    return this;
  }

  static getInstance() {
    if (!RestCollector.instance) {
      RestCollector.instance = new RestCollector();
    }

    return RestCollector.instance;
  }
}

module.exports = RestCollector.getInstance();
