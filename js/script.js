
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + "," + cityStr;
    // load streetview
    $greeting.text("So, you want to live at " + address + "?");
    // YOUR CODE GOES HERE!
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address+ " ";
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');
    
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=71e9484fc359486d8de01608a96a7e6d'

    $.getJSON(nytimesUrl, function(data){

        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        articles = data.response.docs;
        for (var i=0; i< articles.length; i++)
        {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>' + article.snippet + '</p>'+
            '</li>');
        };



    }).error(function(e){
        $nytHeaderElem.text("Error, Error")
    });

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to Load Wiki");},8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function (response) {
            var articlesList = response[1];
            for (var i = 0;i<articlesList.length;i++){
                articleStr = articlesList[i];
                var url = 'http://en.wikipedia.org/wiki/'+articleStr;
                $wikiElem.append('<li><a href="' + url + '">' +articleStr + '</a></li>');

                }

                clearTimeout(wikiRequestTimeout);
 

            }
    });

    return false;
};

$('#form-container').submit(loadData);
