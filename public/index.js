var Vue = require("vue");
require("./gantt.js");
var moment = require("moment");
var request = require("superagent");
var Router = require('director').Router;
var router = new Router();

function sample(){
    return [
        [
            "仕様書作成",
            moment().add(-1, 'days').format("M/D"),
            moment().add(3, 'days').format("M/D")
        ],[
            "コーディング",
            moment().add(3, 'days').format("M月D日"),
            moment().add(6, 'days').format("M月D日")
        ],[
            "テスト",
            moment().add(4, 'days').format("YYYY/MM/DD"),
            moment().add(10, 'days').format("YYYY/MM/DD")
        ]
    ].map(function(item){
        return item.join(" ")
    }).join("\r\n");
}


new Vue({
    el: "#main",
    data: {
        post: {
            title: "Untitled",
            contents: ""
        },
        posts: [],
        tasks: [],
        showHelp: false
    },
    methods: {
        update: function(textData){
            localStorage["ganttPad"] = textData;
            this.tasks = textData.split(/\r|\n|\r\n/).map(function(line){
                line = line.replace(/／/g, "/");
                line = line.replace(/　/g, " ");
                line = line.replace(/〜/g, " ");
                var args = line.split(" ");

                var inputPattern = [
                    "MM/DD",
                    "MM月DD日",
                    "YYYY年MM月DD日",
                    "YYYY/MM/DD",
                    "YYYY-MM-DD"
                ];

                var startTime = moment.utc(args[1], inputPattern);
                var endTime = moment.utc(args[2], inputPattern);

                if(args.length > 2){
                    return {
                        name: args[0],
                        start: startTime.unix()*1000,
                        end: endTime.unix()*1000 + 1000*60*60*24
                    };
                }
                return null;
            }).filter(function(item){return item});
        },
        createPost : function(){
        },
        savePost : function(){
            alert("Not implemented");
        },
        openPost : function(_id){
            router.setRoute('/' + _id);
        }
    },
    ready: function(){
        var self = this;
        var storage = localStorage["ganttPad"];
        if(storage == undefined || storage.trim().length === 0 ){
            this.textData = sample();
        }else{
            this.textData = localStorage["ganttPad"];
        }
        this.update(this.textData);
        
        request.get("/api", function(err, res){
            if(err){
                alert(err);
            }
            self.posts = res.body;
        })
        
        router.on('/:id', function (id) {
            request.get("/api/" + id, function(err, res){
                if(err){
                    alert(err);
                }
                self.post = res.body;
                alert("loaded");
            })
        });
        router.init('/')
    }
});