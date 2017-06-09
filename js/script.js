(function () {
  function init() {
    $(".btn[type=submit]").click(search);
    $("#search-field").keypress(keyIdentify);
    $("#limit").keypress(keyIdentify);
  }

  function keyIdentify(e) {
    if(e.keyCode == 13) { //enter
      search();
    }

  }

  function search() {
    loadedImageCount = 0;
    var query = $("#search-field").val();
    var limit = $("#limit").val();

    $("#images").empty();
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

  function appendImage(url) {
    var imgEl = $("<img>");

    imgEl.attr({
      "src": url
    }).addClass("img materialboxed");

    imgEl.on("error", function (e) {
      $(this).remove();
    });

    $("#images").append(imgEl);
  }

  function getImages(obj) {
    obj = obj || {};
    obj.limit = obj.limit || 100;
    obj.category = obj.category || 'cats';

    var url = 'https://www.reddit.com/r/pics/search.json?q=';
    url += obj.category + ".png";
    url += '/&limit=' + obj.limit;
    get(url, getResponse);
  }

  function getResponse(status, headers, body) {
    var a = 0;
    var response = JSON.parse(body);
    _.each(response.data.children, function (child) {
      var url = child.data.url;
      a++;

      if (url.match(/\.png$/)) {
        appendImage(url);
        $('.materialboxed').materialbox();
      }
    });
  }
  init();
})();