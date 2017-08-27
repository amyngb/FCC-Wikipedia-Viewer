// *********Get data**************
var wApiHost = 'https://en.wikipedia.org/w/api.php';
var searchParam = '?action=query&format=json&prop=extracts&iwurl=1&generator=search&exsentences=4&exintro=1&explaintext=1&gsrsearch=butterfly&gsrlimit=10';
var wikiID = 'https://en.wikipedia.org/?curid=';
var dataArr = [];
// ************ Data Storage **************

function reorderArticles (result) {
  jQuery.each(result.query.pages, function() {
    dataArr.push([$(this)]);
  })
  dataArr.sort(function (a, b) {
    if (a[0][0].index < b[0][0].index) {
      return -1;
    }
    if (a[0][0].index > b[0][0].index) {
      return 1;
    }
    return 0;
  })
  generateArticles(dataArr);
  console.log(dataArr);
  console.log(dataArr[0][0][0].title);

}


$(document).ready(function () {
  //Get user input
  getInput();
  //Access wiki api
  function getInput() {
    //on click
    $('#searchButton').on('click', function(){
      callback();
      })
    //on keypress of enter
    $("input").keypress(function() {
      if (event.which == 13) callback();
    });
    //do this on keypress or click
      function callback() {
      var keyword = $('#keyword').val();
      if (keyword) {
      clearArticles();

      $.ajax({
        type: "GET",
        url: 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&iwurl=1&generator=search&exsentences=4&exintro=1&explaintext=1&gsrsearch=' + keyword + '&gsrlimit=10',
        dataType: 'jsonp',
        success: function(response){
          reorderArticles(response);
        }
      })
      }

      changeTitles();
      changeArticles();
    }
}
})

  //Keyword search


  // ********Update UI*************

function clearArticles() {
var clearMe = document.getElementById('article-generator');
while(clearMe.hasChildNodes()) {
  clearMe.removeChild(clearMe.lastChild);
}
}

function generateArticles(dataArr){
  for (var i = 0; i<= dataArr.length; i++){
    var articleGen =  document.getElementById('article-generator');
    var headline = dataArr[i]['0']['0'].title;
    var content = dataArr[i]['0']['0'].extract;

    //use hasOwnProperty

    articleGen.insertAdjacentHTML('afterbegin', '<div class="col-10 col-md-8 article"><h4 class="article-headline">' + headline + '</h4> <p class="article-content">"' + content + '"</p> </div>')

  }

}

function changeArticles() {
console.log();
}

function changeTitles() {

}
