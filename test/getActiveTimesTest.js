const expect = require("chai").expect;
const moment = require("moment");
const getActiveTimes = require("../lib/getActiveTimes");

describe("getActiveTimes", function() {
  var straddleEvents = [
    {
      timestamp: moment("2019-01-22T21:59:00-0600", moment.ISO_8601).valueOf(),
      status: "online"
    },
    {
      timestamp: moment("2019-01-23T02:01:00-0600", moment.ISO_8601).valueOf(),
      status: "offline"
    }
  ];

  it("fills past the last online event ", function() {
      var expected = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1
      ]
      var result = getActiveTimes(straddleEvents, 2)
      expect(result).to.have.lengthOf(24);
      expect(result).to.eql(expected);
  });

  it("fills before the first offline event", function() {
      var expected = [
      1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]
    var result = getActiveTimes(straddleEvents, 3);
    expect(result).to.have.lengthOf(24);
    expect(result).to.eql(expected);
  });

  it("fills between two events", function() {
    var middayEvents = [
        {
            timestamp: moment("2019-01-25T08:00:00-0600", moment.ISO_8601).valueOf(),
            status: "online"
        },
        {
            timestamp: moment("2019-01-25T17:00:00-0600", moment.ISO_8601).valueOf(),
            status: "offline"
        }
    ];
    var expected = [
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0
    ];
    var result = getActiveTimes(middayEvents, 5);
    expect(result).to.have.lengthOf(24);
    expect(result).to.eql(expected);
  });

  it("ignores short offline events", function() {
    var shortEvents = [
        {
            timestamp: moment("2019-01-25T00:00:00-0600", moment.ISO_8601).valueOf(),
            status: "online"
        },
        {
            timestamp: moment("2019-01-25T00:04:59-0600", moment.ISO_8601).valueOf(),
            status: "offline"
        }
    ];
    var expected = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    var result = getActiveTimes(shortEvents, 5);
    expect(result).to.have.lengthOf(24);
    expect(result).to.eql(expected);
  })
});
