(function () {
  function init() {
    console.log("init");
    $(".btn[type=submit]").click(search);
  }

  function search() {
    var query = $("#search-field").val();
    var limit = $("#limit").val();

    if (!query && !limit) {
      getImages();
    } else {
      getImages({
        category: query,
        limit: limit
      })
    }
  }

  function get(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState != xhr.DONE) return;

      var status = xhr.status;
      var headers = xhr.getAllResponseHeaders();
      var text = xhr.responseText;

      callback(status, headers, text);
    }

    xhr.send();
  }

  try {
    function appendImage(url) {
      var imgEl = document.createElement('img');

      imgEl.src = url;

      imgEl.onerror = function (e) {
        $(imgEl).remove();
        throw e
      }

      document.getElementById('images').appendChild(imgEl);
    }
  }
  catch(e) {
    console.log(e);
  }

  function getImages(obj) {
    $("#images").empty();

    obj = obj || {};
    obj.limit = obj.limit || 100;
    obj.category = obj.category || 'cats';

    var url = 'https://www.reddit.com/r/pics/search.json?q=';
    url += obj.category + ".png";
    url += '/&limit=' + obj.limit;

    get(url, function (status, headers, body) {
      console.log("get");
      var a = 0;
      var response = JSON.parse(body);
      _.each(response.data.children, function (child) {
        var url = child.data.url;
        a++;

        if (url.match(/\.png$/)) {
          appendImage(url);
        }
      });
    });
  }

  init();
})();