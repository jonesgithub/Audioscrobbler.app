function localize(s)
{
    // lol yeah, we'll do it properly when we can (ie. not just english style)
    rgx = /(\d+)(\d{3})/;
    while (rgx.test(s))
        s = s.replace(rgx, '$1'+','+'$2');
    return s;
}

var artist;
var artist_url;
var listeners;
var bio;

function artist_got_info(json)
{
    artist = json.artist.name;
    artist_url = json.artist.url;
    listeners = json.artist.stats.listeners;
    bio = json.artist.bio.content;
    
    // Last.fm returns HTML, but no paragraph formatting :P
    bio = bio.replace(/(\n|\r)+/g, "<p>");
    // Don't open the URL inside the widget!
    bio = bio.replace(/(href=\")+(https?\:\/\/[^\s<>\"$]+)/ig, 'href="javascript:window.widget.openURL(\'$2\');return false;');

    img = new Image();
    img.onload = function() {
        var h = this.height;
        var back = document.getElementById('image');
        back.style.height = parseInt(h)+"px";
        back.style.backgroundImage='url('+this.src+')';

        document.getElementById('artist').href = "javascript:window.widget.openURL('"+artist_url+"');return false;";
        document.getElementById('artist').innerHTML = artist;
        document.getElementById('listeners').innerText = localize(listeners)+' listeners';
        document.getElementById('bio').innerHTML = bio;
            
        window.resizeTo(286, h+34);
    }
    img.src = json.artist.image[3]['#text'];
}

function set_artist(scpt)
{
    artist = $.trim(scpt.outputString);
    if (document.getElementById('artist').innerText != artist)
        $.getJSON("http://ws.audioscrobbler.com/2.0/?callback=?",
                  { method: "artist.getinfo", 
                    api_key: "b25b959554ed76058ac220b7b2e0a026", 
                    artist: artist,
                    format: "json", 
                  }, artist_got_info);
}

function show()
{
    window.widget.system('/usr/bin/osascript np.scpt', set_artist);
}

if (window.widget) {
    widget.onshow = show;
}
