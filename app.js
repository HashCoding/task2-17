(function() {
    
    var _ = {
        addHandle: function (element, type, handler) {
            if(element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if(element.attachEvent) {
                element.attachEvent('on'+type, handler);
            } else {
                element['on'+type] = handler;
            }
        }
    }    

    /* 数据格式演示
    var aqiSourceData = {
    "北京": {
        "2016-01-01": 10,
        "2016-01-02": 10,
        "2016-01-03": 10,
        "2016-01-04": 10
    }
    };
    */

    // 以下两个函数用于随机模拟生成测试数据
    function getDateStr(dat) {
        var y = dat.getFullYear();
        var m = dat.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = dat.getDate();
        d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d;
    }
    function randomBuildData(seed) {
        var returnData = {};
        var dat = new Date("2016-01-01");
        var datStr = ''
        for (var i = 1; i < 92; i++) {
            datStr = getDateStr(dat);
            returnData[datStr] = Math.ceil(Math.random() * seed);
            dat.setDate(dat.getDate() + 1);
        }
        return returnData;
    }

    var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
    };

    /**
     *  获取当前时间粒度
     */
    var getGraTime = function () {
        var graTime = document.getElementsByName('gra-time');
        
        for(var i = 0, l = graTime.length; i < l; i++) {
            if(graTime[i].checked) {
                return graTime[i].value;
            }
        }
    }
    
    // 用于渲染图表的数据
    // {2016-01-01: 1, 2016-01-02: 2....}
    // {1月: 231, 2月: 303, 3月: 200...}
    var chartData = {};

    // 记录当前页面的表单选项
    var pageState = {
        nowSelectCity: -1,
        nowGraTime: "day"
    }

    /**
     * 渲染图表
     */
    function renderChart() {
        console.log('renderChart is ok');
        
        var str = '';
        for(var i in chartData) {
            str += '<div class="box ' + pageState.nowGraTime + '">';
            str += '<div class="data" style="height: ' + chartData[i] + 'px" title="' + i + ',' + chartData[i] + '"></div>';
            str += '</div></div>';
        }
        
        var aqiChartWrap = document.getElementsByClassName('aqi-chart-wrap')[0];
        aqiChartWrap.innerHTML = str;
    }

    /**
     * 日、周、月的radio事件点击时的处理函数
     */
    var graTimeChange = function() {
        console.log('gra time change is ok')
        // 确定是否选项发生了变化
        
        var nowGraTime = getGraTime();
        console.log('now ' + nowGraTime + ' is checked')
        if(nowGraTime === pageState.nowGraTime) {
            return;
        } else {
            // 设置对应数据
            initAqiChartData();
            // 调用图表渲染函数
            renderChart();
        }
    }

    /**
     * select发生变化时的处理函数
     */
    function citySelectChange() {
    // 确定是否选项发生了变化 

    // 设置对应数据

    // 调用图表渲染函数
    }

    /**
     * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
     */
    var initGraTimeForm = function() {
        console.log('initGraTimeForm is ok');
        
        var graTime = document.getElementsByName('gra-time');
        
        for(var i = 0, l = graTime.length; i < l; i++) {
            _.addHandle(graTime[i], 'click', graTimeChange);
            console.log('radio click event is ok');
        }
    }

    /**
     * 初始化城市Select下拉选择框中的选项
     */
    function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项

    // 给select设置事件，当选项发生变化时调用函数citySelectChange

    }


    /**
     * 初始化图表需要的数据格式
     */
    var initAqiChartData = function() {
        console.log('init aqichartdata is ok')
       
        var nowGraTime = getGraTime();
        var nowSelectCity = document.getElementById('city-select').value;
        // 保存状态
        pageState.nowGraTime = nowGraTime;
        pageState.nowSelectCity = nowSelectCity;
        
        console.log(pageState)
        
        // 将原始的源数据处理成图表需要的数据格式
        // 处理好的数据存到 chartData 中
        if(nowGraTime === 'day') {
            chartData = aqiSourceData[nowSelectCity];
             // {2016-01-01: 1, 2016-01-02: 2....}
            // console.log(chartData);
        } else if(nowGraTime === 'week') {
            // 好难，先等等
            var tepData = aqiSourceData[nowSelectCity];
            for (var i in tepData) {
                
            }
        } else if(nowGraTime === 'month') {
            chartData = {};
            var tepData = aqiSourceData[nowSelectCity];
            var count = 0, total = 0, flag = -1;
            // flag 代表现在的月份, 当新的日子不是之前的话要计算的数归0,并且存储上月的数据
            for (var day in tepData) {
                if(flag === -1) {
                    flag = parseInt(day.split('-')[1]);
                } else if(parseInt(day.split('-')[1]) != flag) {
                    
                    // 存储上月数据, 四舍五入
                    chartData[flag + '月'] = Math.round(total/count);
                    
                    flag = parseInt(day.split('-')[1]);
                    count = 0;
                    total = 0;
                }
                
                // 新的一天
                count ++;
                total += tepData[day];
            }
            
            // 最后一月的数据
            chartData[flag + '月'] = Math.round(total/count);
            
            // console.log(chartData);
            // {1月: 231, 2月: 303, 3月: 200...}
        }
    }


    /**
     * 初始化函数
     */
    var init = function() {
        console.log('init is ok')
        
        initGraTimeForm();
        initCitySelector();
        initAqiChartData();
        renderChart();
    }

    init();
        
    
})();