const youtube_URL = 'https://www.googleapis.com/youtube/v3/search';
let page = 0;
var initialPageToken;
var searchQuery;

function getPageId(n) {
  return 'result-page-' + n;
}

function getDocHeight() {
  const body = document.body;
  const html = document.documentElement;

  return Math.max(
    body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight
  );
}

function getScrollTop() {
  return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

function getVideoData(searchTerm, callback) {
  if (page == 1) {
    var query = {
      part: 'snippet',
      key: 'AIzaSyBUlJDadHRKtg7aOfHtBUXxfy5-ZRYKX9Y',
      q: searchTerm,
      maxResults: 10,
    };
    $.getJSON(youtube_URL, query, callback)
  } else {
      var query = {
        part: 'snippet',
        key: 'AIzaSyBUlJDadHRKtg7aOfHtBUXxfy5-ZRYKX9Y',
        q: searchTerm,
        maxResults: 10,
        pageToken: initialPageToken
      };
      $.getJSON(youtube_URL, query, callback)
    };
}

function displayVideoData(data) {
  var result = '';
  if (data.items) {
    initialPageToken = data.nextPageToken;
    data.items.forEach(function(item) {
      if (item.id.kind == "youtube#video") {
        result += '<li class="js-search-results-item">' + item.snippet.title +
        '</br><a href="https://www.youtube.com/watch?v=' + item.id.videoId + '"><img src="' +
        item.snippet.thumbnails.medium.url +
        '" class="img-thumbnail" alt="' + item.snippet.title +
        '" width="300"></a></li>'
      } else if (item.id.kind == "youtube#channel") {
        result += '<li class="js-search-results-item">' + item.snippet.title +
        '</br><a href="https://www.youtube.com/channel/' + item.id.channelId + '"><img src="' +
        item.snippet.thumbnails.medium.url +
        '" class="img-thumbnail" alt="' + item.snippet.title +
        '" width="300"></a></li>'
      } else if (item.id.kind == "youtube#playlist") {
        result += '<li class="js-search-results-item">' + item.snippet.title +
        '</br><a href="https://www.youtube.com/playlist?list=' + item.id.playlistId + '"><img src="' +
        item.snippet.thumbnails.medium.url +
        '" class="img-thumbnail" alt="' + item.snippet.title +
        '" width="300"></a></li>'}
    });
  }
  else {
    result += '<p>No results</p>';
  }
  $('.js-search-results').append('<ul class="js-search-results-page-' + page + '">' + result + '</ul>');
}

function addPage(page) {
  getVideoData(searchQuery, displayVideoData)
  addPaginationPage(page);
}

function watchSubmit() {
  $('.js-search-form').submit(function(e) {
    e.preventDefault();
    ++page;
    $('.js-search-results').empty();
    searchQuery = $(this).find('#js-query').val();
    getVideoData(searchQuery, displayVideoData);
  });
}

$(function(){watchSubmit();});

window.onscroll = function() {
  if (getScrollTop() < getDocHeight() - window.innerHeight) return;
  addPage(++page);
}
