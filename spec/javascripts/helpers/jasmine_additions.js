/**
 * Logs the given string to the current logger.
 *
 * @param {String} string to log
 * @static
 */
jasmine.log = function(string) {
  var env = jasmine.getEnv();
  env.reporter.log(string);
};

/**
 * Loads a given fixture file into the jasmine_content div.
 *
 * @param {String} filename of the fixture you want to load (minus the .html)
 * @static
 */
jasmine.loadFixture = function(filename) {
  if (!jasmine.fixtures[filename]) throw('Unable to load that fixture.');
  document.getElementById('jasmine_content').innerHTML = jasmine.fixtures[filename];
  // might want to eval the string here as well
};




/**
 * Pending functionality
 *------------------------------------------------------------------------------*/
jasmine.TrivialReporter.prototype.reportSpecResults = function(spec) {
  var results = spec.results();
  var status = results.passed() ? 'passed' : 'failed';
  var style = '';
  if (results.skipped) {
    status = 'skipped';
  }
  if (results.failedCount == 0 && results.passedCount == 0 && !results.skipped) {
    status = 'pending';
    style = "background-color: #FFA200; border: 1px solid #000000";
  }
  var specDiv = this.createDom('div', { className: 'spec '  + status, style: style },
      this.createDom('a', { className: 'run_spec', href: '?spec=' + encodeURIComponent(spec.getFullName()) }, "run"),
      this.createDom('a', {
        className: 'description',
        href: '?spec=' + encodeURIComponent(spec.getFullName()),
        title: spec.getFullName()
      }, spec.description));


  var resultItems = results.getItems();
  var messagesDiv = this.createDom('div', { className: 'messages' });
  for (var i = 0; i < resultItems.length; i++) {
    var result = resultItems[i];
    if (result.passed && !result.passed()) {
      messagesDiv.appendChild(this.createDom('div', {className: 'resultMessage fail'}, result.message));

      if (result.trace.stack) {
        messagesDiv.appendChild(this.createDom('div', {className: 'stackTrace'}, result.trace.stack));
      }
    }
  }

  if (messagesDiv.childNodes.length > 0) {
    specDiv.appendChild(messagesDiv);
  }

  this.suiteDivs[spec.suite.getFullName()].appendChild(specDiv);
};

var pending = function(desc) {
  return jasmine.getEnv().pending(desc);
};

jasmine.Env.prototype.pending = function(description, func) {
  var spec = new jasmine.Spec(this, this.currentSuite, description);
  this.currentSuite.add(spec);
  this.currentSpec = spec;

  if (func) {
    spec.pending(func);
  }

  return spec;
};

jasmine.Spec.prototype.pending = function (e) {
  var expectationResult = new jasmine.MessageResult('pending');
  this.results_.addResult(expectationResult);
};
