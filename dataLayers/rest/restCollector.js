class RestCollector {
  constructor() {
    this._initializeData();
  }

  _initializeData() {
    this.executionTime = 0;
    this.requests = [];
  }

  reset() {
    this._initializeData();
  }

  addRequest({ executionTime, request }) {
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
