Vue.component("gantt", {
    template: "<div class='ganttGraph'>",
    ready: function(){
        var self = this;
        var margin = {top: 20, right: 20, bottom: 30, left: 20},
            width = parseInt(d3.select(".ganttGraph").style("width"), 10) - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        //初期表示範囲設定
        var now = new Date();
        var dateStart = new Date(now.getTime());
        dateStart.setDate(dateStart.getDate() - 3);
        var dateEnd = new Date(now.getTime());
        dateEnd.setDate(dateEnd.getDate() + 15);

        var xScale = d3.time.scale()
            .domain([dateStart, dateEnd])
            .range([0, width]);

        //曜日表示を日本語に設定
        var ja_JP = d3.locale({
            "decimal": ".",
            "thousands": ",",
            "grouping": [3],
            "currency": ["", "円"],
            "dateTime": "%a %b %e %X %Y",
            "date": "%Y/%m/%d",
            "time": "%H:%M:%S",
            "periods": ["AM", "PM"],
            "days": ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
            "shortDays": ["日", "月", "火", "水", "木", "金", "土"],
            "months": ["01月", "02月", "03月", "04月", "05月", "06月", "07月", "08月", "09月", "10月", "11月", "12月"],
            "shortMonths": ["01月", "02月", "03月", "04月", "05月", "06月", "07月", "08月", "09月", "10月", "11月", "12月"]
        });

        //X軸表示設定
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(d3.time.day.utc, 1)
            .tickSize(-height)
            .tickFormat(ja_JP.timeFormat("%d%a"));

        var update = function (data) {
            var tasks = svg.selectAll("rect.taskRange")
                .data(data);

            tasks.enter()
                .append("rect")
                .attr("class", "taskRange");

            tasks.exit().remove();

            var text = svg.selectAll("text.taskName")
                .data(data);

            text.enter()
                .append("text")
                .attr("class", "taskName");

            text.exit().remove();

            //ズーム
            svg.select(".x.axis").call(xAxis);

            //タスク表示
            tasks.attr("x", function (item) {
                return xScale(item.start);
            }).attr("y", function (item, i) {
                return i * 40 + 20
            }).attr("width", function (item) {
                return Math.abs(xScale(item.end) - xScale(item.start));
            }).attr("height", 10);

            //タスクのラベル表示
            text.text(function (item) {
                return item.name
            })
                .attr("text-anchor", "end")
                .attr("x", function (item) {
                    return xScale(item.start) - 10
                })
                .attr("y", function (item, i) {
                    return i * 40 + 28
                });
        };

        //ズーム範囲設定
        var zoom = d3.behavior.zoom()
            .x(xScale)
            .scaleExtent([0.5, 10])
            .on("zoom", function () {
                update(self.tasks);
            });

        //SVG生成
        var svg = d3.select(".ganttGraph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);//zoom関数に引数付きでセレクションを渡す

        //ズーム当たり判定
        svg.append("rect")
            .attr("width", width)
            .attr("height", height);

        //X軸目盛り追加
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        this.$watch("tasks", function(tasks){
            update(tasks);
        }, false, true);
    }
});
