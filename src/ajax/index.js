 function  ajax(url,opt,methods,contentType){
    return new Promise(function(resove,reject){
        methods = methods || 'POST';
        var xmlHttp = null;
        if (XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else {
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        };
        var params = [];
        for (var key in opt){
            //if(!!opt[key] || opt[key] === 0){
                params.push(key + '=' + opt[key]);
            //}
        };
        var postData = params.join('&');
        if (methods.toUpperCase() === 'POST') {
            xmlHttp.open('POST', url, true);
            if(!!contentType){
                xmlHttp.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
                xmlHttp.send(JSON.stringify(opt));
            }else{
                xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                xmlHttp.send(postData);
            }

        }else if (methods.toUpperCase() === 'GET') {
            xmlHttp.open('GET', url + '?' + postData, true);
            xmlHttp.send(null);
        }else if(methods.toUpperCase() === 'DELETE'){
            xmlHttp.open('DELETE', url + '?' + postData, true);
            xmlHttp.send(null);
        }
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                resove(JSON.parse(xmlHttp.responseText));
            }else if(xmlHttp.readyState == 4){

            }
        };
    })
};
export default ajax;