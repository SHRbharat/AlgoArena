// Testcases status mapping
export const statuses = {
  1: "In Queue",
  2: "Processing",
  3: "Accepted",
  4: "Wrong Answer",
  5: "Time Limit Exceeded",
  6: "Compilation Error",
  7: "Runtime Error (SIGSEGV)",
  8: "Runtime Error (SIGXFSZ)",
  9: "Runtime Error (SIGFPE)",
  10: "Runtime Error (SIGABRT)",
  11: "Runtime Error (NZEC)",
  12: "Runtime Error (Other)",
  13: "Internal Error",
  14: "Exec Format Error",
};

// Language mapping with boilerplates (Base64-encoded)
export const languages = {
  50: {
    name: "C (GCC 9.2.0)",
    is_archived: false,
    boilerplate: "I2luY2x1ZGUgPHN0ZGlvLmg+Ci8qIFN0YXJ0IHlvdXIgY29kZSBoZXJlICovCmludCBtYWluKCkgewogICAgcHJpbnRmKFwiSGVsbG8sIHdvcmxkIVxcbiIpOwogICAgcmV0dXJuIDA7Cn0="
  },
  54: {
    name: "C++ (GCC 9.2.0)",
    is_archived: false,
    boilerplate: "I2luY2x1ZGUgPGlvc3RyZWFtPg0KdXNpbmcgbmFtZXNwYWNlIHN0ZDsNCg0KaW50IG1haW4oKSB7DQogICAgY291dCA8PCJIZWxsbywgd29ybGQhXG4iOw0KICAgIHJldHVybiAwOw0KfQ=="
  },
  62: {
    name: "Java (OpenJDK 13.0.1)",
    is_archived: false,
    boilerplate: "cHVibGljIGNsYXNzIE1haW4gewogICAgcHVibGljIHN0YXRpYyB2b2lkIG1haW4oU3RyaW5nW10gYXJncykgewogICAgICAgIFN5c3RlbS5vdXQucHJpbnRsbigiSGVsbG8sIHdvcmxkISIpOwogICAgfQp9"
  },
  63: {
    name: "JavaScript (Node.js 12.14.0)",
    is_archived: false,
    boilerplate: "Y29uc29sZS5sb2coJ0hlbGxvLCB3b3JsZCEnKTs="
  },
  71: {
    name: "Python (3.8.1)",
    is_archived: false,
    boilerplate: "cHJpbnQoIkhlbGxvLCB3b3JsZCEiKQ=="
  }
};
