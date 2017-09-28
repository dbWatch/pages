$(document).ready(function(){

    var initChart=function(chartDef, index){
        if(chartDef["chart"]=="pie"){
                var dataPreferences = {
                    series: [
                        [1]
                    ]
                };

                var optionsPreferences = {
                    donut: true,
                    donutWidth: 40,
                    startAngle: 0,
                    total: 100,
                    showLabel: false,
                    axisX: {
                        showGrid: false
                    }
                };

                Chartist.Pie("#"+chartDef["id"], dataPreferences, optionsPreferences);
        };
    }

    var loadFile = function (filePath, updates ,done) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', filePath, true);
            xhr.responseType = 'json';
            xhr.onload = function () {
                var asJson=this.response;
                return done(asJson,updates)
            }
            xhr.send();
    };

    var updateGraphs=function(updateMap){
        for(var aFile in updateMap){
            loadFile(aFile, updateMap[aFile] , function(asJson, updates){
                var arrayLength = updates.length;
                for (var i = 0; i < arrayLength; i++) {
                    var id=updates[i].divId;
                    var pieClass=updates[i].pieClass;
                    console.log("   writing data to: "+id);

                    var mod={
                                "labels": asJson["lables"],
                                "series": asJson["series"].map(function(currentValue) {
                                                              return {
                                                                         value: currentValue,
                                                                         className: pieClass
                                                                       }
                                                          })
                            };
                    Chartist.Pie("#"+id,mod);
                };
            })
        };
    };

        var updateMap=[];
        var divs = document.getElementsByTagName("div"), i=divs.length;
        while (i--) {
            var source=divs[i].getAttribute("source");
            if (source != null){
                if(updateMap[source] == null){
                    updateMap[source]=[];
                }
                updateMap[source].push({
                    dataSource:source,
                    divId:divs[i].getAttribute("id"),
                    chart:divs[i].getAttribute("chart"),
                    pieClass:divs[i].getAttribute("pie-class")
                });
            }
        }
        for(var file in updateMap){
            updateMap[file].forEach(initChart)
        }

        window.setInterval(function(){updateGraphs(updateMap)}, 1000);

});

