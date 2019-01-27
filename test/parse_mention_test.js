const expect = require("chai").expect;
const parseMention = require("../lib/user_id");

describe("parseMention", function() {
  it("does not match invalid things", function() {
      expect(parseMention('hello')).to.equal(false)
      expect(parseMention('@example')).to.equal(false)
      expect(parseMention('<derp>')).to.equal(false)
  });

  it("matches valid things", function() {
    expect(parseMention('<@28374628734>')).to.equal('28374628734')
  });
});
