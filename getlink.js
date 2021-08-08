document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('button').addEventListener('click', 
    onclick,false)

    function onclick() {
        chrome.tabs.query({currentWindow: true, active: true}, 
            function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, 'hi',classify);
            })
    }
    
    function classify(res){
        mal_link=[]
        for(var i=0;i<res.data.length;i++){
            const Http = new XMLHttpRequest();
            url="https://safensound.herokuapp.com/predict?url="+res.data[i]
            Http.open("GET", url);
            Http.send();

            Http.onreadystatechange = (e) => {
                var data=String(Http.responseText).split("\"");
                mal_link+=data[3]
            }
        }
        alert(mal_link.length);
    }
},false)