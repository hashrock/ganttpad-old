var Vue = require("vue");
var GanttChart = require("./gantt_chart.js");

Vue.component("gantt", {
    template: "<div class='ganttGraph'>",
    props: ["tasks"],
    ready: function () {
        var gantt = new GanttChart();
        gantt.initialize();
        this.$watch("tasks", function (tasks) {
            gantt.update(tasks);
        }, false, true);
    }
});