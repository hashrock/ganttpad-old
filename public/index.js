var Vue = require("vue");
require("./gantt.js");
var moment = require("moment");
var request = require("superagent");
var _ = require("underscore");
var Router = require('director').Router;
var router = new Router();

function sample() {
    return [
        [
            "仕様書作成",
            moment().add(-1, 'days').format("M/D"),
            moment().add(3, 'days').format("M/D")
        ], [
            "コーディング",
            moment().add(3, 'days').format("M月D日"),
            moment().add(6, 'days').format("M月D日")
        ], [
            "テスト",
            moment().add(4, 'days').format("YYYY/MM/DD"),
            moment().add(10, 'days').format("YYYY/MM/DD")
        ]
    ].map(function (item) {
        return item.join(" ")
    }).join("\r\n");
}

var app = new Vue({
    el: "#main",
    data: {
        editing: {
            title: null,
            contents: ""
        },
        posts: [],
        tasks: [],
        saved: false,
        showHelp: false
    },
    computed: {
        saveButtonLabel: function(){
            return this.saved ? "Saved" : "Save";
        }
    },
    methods: {
        update: function (textData) {
            if(lastContents !== this.editing.contents || lastTitle !== this.editing.title){
                this.saved = false;
            }
            autoSave();
            
            this.tasks = textData.split(/\r|\n|\r\n/).map(function (line) {
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

                if (args.length > 2) {
                    return {
                        name: args[0],
                        start: startTime.unix() * 1000,
                        end: endTime.unix() * 1000 + 1000 * 60 * 60 * 24
                    };
                }
                return null;
            }).filter(function (item) { return item });
        },
        createPost: function () {
            var title = prompt("Title");
            if (title) {
                request
                    .post("/api")
                    .type('form')
                    .send({ title: title, contents: "" })
                    .end(function (err, res) {
                        if(err){
                            alert(err);
                        }
                        var _id = res.body.posted._id;
                        router.setRoute('/' + _id);
                    });
            }
        },
        savePost: function () {
            if(!this.editing.title){
                this.createPost();
            }else{
                save();
            }
        },
        openPost: function (_id) {
            router.setRoute('/' + _id);
        }
    },
    ready: function () {
        var self = this;
        request.get("/api", function (err, res) {
            if (err) {
                alert(err);
            }
            self.posts = res.body;
        })

        router.on('/:id', function (id) {
            request.get("/api/" + id, function (err, res) {
                if (err) {
                    alert(err);
                }
                
                self.editing = res.body;
                backup(self.editing);
                self.update(self.editing.contents);
            })
        });
        
        router.on("/", function (){
            
        })
        
        
        router.init('/')
    }
});

function backup(editing){
    lastContents = editing.contents;
    lastTitle = editing.title;
    app.$data.saved = true;
}

var lastTitle = "";
var lastContents = "";

var save = function(){
    var self = app.$data;
    request
        .put("/api/" + self.editing._id)
        .type('form')
        .send({ title: self.editing.title, contents: self.editing.contents })
        .end(function (err, res) {
            if(err){
                alert(err);
            }
            backup(self.editing);
            self.saved = true;
            console.log("saved");
        });
    
}

var autoSave = _.debounce(function() {
    var self = app.$data;
    if(lastTitle === self.editing.title && lastContents === self.editing.contents){
        return;
    }
    save();
}, 2000);

