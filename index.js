var Vue = require("vue");
require("./gantt.js");

new Vue({
    el: "#main",
    data: {
        textData: "test 2015-3-20 2015-3-24\r\ntest2 2015-3-19 2015-3-22",
        tasks: []
    },
    methods: {
        update: function(textData){
            this.tasks = textData.split(/\r|\n|\r\n/).map(function(line){
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
        }
    },
    ready: function(){
        this.update(this.textData);
    }
});