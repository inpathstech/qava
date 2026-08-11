/**
 * CloudFront Function (viewer-request) — host-based 301 to Club domains.
 * Attach to distributions that still receive qava.ai / www.qava.ai /
 * app.qava.ai / apex theclubnyc.com traffic after Stage 4.
 */
function handler(event) {
  var request = event.request;
  var host = ((request.headers.host && request.headers.host.value) || "").toLowerCase();
  var uri = request.uri || "/";
  var qs = "";
  if (request.querystring) {
    var parts = [];
    Object.keys(request.querystring).forEach(function (k) {
      var item = request.querystring[k];
      if (item.multiValue) {
        item.multiValue.forEach(function (v) {
          parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(v.value));
        });
      } else if (item.value !== undefined) {
        parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(item.value));
      } else {
        parts.push(encodeURIComponent(k));
      }
    });
    if (parts.length) qs = "?" + parts.join("&");
  }

  var targetHost = null;
  if (host === "qava.ai" || host === "www.qava.ai" || host === "theclubnyc.com") {
    targetHost = "www.theclubnyc.com";
  } else if (host === "app.qava.ai") {
    targetHost = "app.theclubnyc.com";
  } else if (host === "api.qava.ai") {
    if (uri.indexOf("/admin") === 0) {
      targetHost = "app.theclubnyc.com";
    } else {
      targetHost = "api.theclubnyc.com";
    }
  }

  if (!targetHost) {
    return request;
  }

  return {
    statusCode: 301,
    statusDescription: "Moved Permanently",
    headers: {
      location: { value: "https://" + targetHost + uri + qs },
    },
  };
}
