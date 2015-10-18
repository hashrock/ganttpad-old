var Vue = require("vue");
var GanttChart = require("./gantt_chart.js");
var _ = require("lodash");
var resize;

Vue.component("gantt", {
    template: "<div class='ganttGraph'>",
    props: ["tasks"],
    ready: function () {
        var gantt = new GanttChart();
        gantt.initialize();
        this.$watch("tasks", function (tasks) {
            gantt.data(tasks);
            gantt.update();
        }, false, true);
        
        resize = function(){
            //リサイズの為の一次対応。本来はupdateでリサイズにも対応できたほうがよい
            gantt.initialize();
            gantt.update();
        }

        window.onresize = _.debounce(resize, 300);
    }
});