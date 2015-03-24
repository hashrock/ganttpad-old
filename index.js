var Vue = require("vue");
require("./gantt.js");

new Vue({
    el: "#main",
    data: {
        textData: "test 2014-12-20 2014-12-24\r\ntest2 2014-12-19 2014-12-22",
        tasks: []
    },
    ready: function(){
        var self = this;
        this.$watch("textData", function(textData){
            self.tasks = textData.split(/\r|\n|\r\n/).map(function(line){
                var args = line.split(" ");
                if(args.length > 2){
                    return {
                        name: args[0],
                        start: new Date(args[1]).getTime(),
                        end: new Date(args[2]).getTime()
                    };
                }
                return null;
            }).filter(function(item){return item});
        }, false, true);
    }
});