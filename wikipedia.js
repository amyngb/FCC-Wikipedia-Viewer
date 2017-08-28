$(document).ready(function () {
  //Get user input
  getInput();
  //Add blank space to page, initially
  addSpacing();
  //Access wiki api
  function getInput() {
    //Keyword search on click
    $('#searchButton').on('click', function(){
      apiCall();
    });
    //on keypress of enter
    $("input").keydown(function() {
      if (event.which == 13) {
        $('#searchButton').css('background-color', '#1675e9');
        apiCall();
      }
    });

    $("input").keyup(function() {
      if (event.which == 13) {
        $('#searchButton').css('background-color', '#EAECEE')
        $('#searchButton').mouseenter(function(){
          $(this).css('background-color', '#1675e9');
      });
      $('#searchButton').mouseout(function(){
        $(this).css('background-color', '#EAECEE');
    });
    }
  });
    //do this on keypress or click
    function apiCall() {
    //use the user keyword to search api
      var keyword = $('#keyword').val();
    //clear out old articles
      if (keyword) {
        clearArticles();
        $.ajax({
          type: "GET",
          url: 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&iwurl=1&generator=search&exsentences=2&exintro=1&explaintext=1&gsrsearch=' + keyword + '&gsrlimit=10',
          dataType: 'jsonp',
          success: function(response){
            reorderArticles(response);
            console.log(response);
            }
          })
        }
      }
    }
  })


// ************ Data Storage **************
var dataArr = [];
function reorderArticles (result) {
  //clear old data
  if (dataArr !==[]) {
    dataArr = [];
  }
  //push objects from JSON into array
  jQuery.each(result.query.pages, function() {
    dataArr.push([$(this)]);
  })
  //order those objects by JSON index number
  dataArr.sort(function (a, b) {
    if (a[0][0].index > b[0][0].index) {
      return -1;
    }
    if (a[0][0].index < b[0][0].index) {
      return 1;
    }
    return 0;
  })
  generateArticles(dataArr);
}

  // ********Update UI*************

//add initial spacing to page
function addSpacing(){
    document.getElementById('aftersearchbox').insertAdjacentHTML('afterend', '<div id="spacing"></div>');
}
//clear previous articles from UI
function clearArticles() {
  for (var i = 0; i <= dataArr.length + 2; i++){
    var clearMe = document.getElementById('article-generator');
    if(clearMe.hasChildNodes()) {
      clearMe.removeChild(clearMe.lastChild);
    }
  }
}

function generateArticles(dataArr){
  //remove empty page spacing if it's there
  var spacing = document.getElementById('spacing');
  if (spacing) {
    spacing.parentNode.removeChild(spacing);
  }
  //insert articles into UI
  for (var i = 0; i<= dataArr.length; i++){
    var articleGen =  document.getElementById('article-generator');
    var headline = dataArr[i][0][0].title;
    var content = dataArr[i][0][0].extract;
    var wikiID = 'https://en.wikipedia.org/?curid=';
    var link = wikiID + dataArr[i]['0']['0'].pageid;

    articleGen.insertAdjacentHTML('afterbegin', '<div class="col-10 col-md-8 article"><a  class= "link-unstyled-article" target = "_blank" href=' + link + '><h4 class="article-headline">' + headline + '</h4> <p class="article-content">"' + content + '"</p> </a></div>')
  }
}
