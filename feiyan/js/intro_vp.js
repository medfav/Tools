/* eslint-disable */
$(document).ready(function() {
  if (!isMobile.any) {
    $('body').addClass('pc');
  } else {
    $('body').addClass('mobile');
  }
  // 缩放
  (function() {
    let scaleX = window.innerWidth / 750;
    if (scaleX < 1) {
      $('#scaleContainer')
        .css('transform', 'scale(' + scaleX + ')')
        .show();
      $('.pop_qs').css('transform', 'scale(' + scaleX + ') translate(-50%, -50%)');
      $('.button, .placeNavMove').css({
        transform: 'scale(' + scaleX + ')'
      });
    } else {
      $('#scaleContainer').show();
      $('.button, .placeNavMove').css({
        'margin-left': (window.innerWidth - 750) / 2
      });
    }
  })();
  // resize
  (function() {
    window.addEventListener('resize', resizeThrottler, false);
    let resizeTimeout;
    function resizeThrottler() {
      // ignore resize events as long as an actualResizeHandler execution is in the queue
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(function() {
          resizeTimeout = null;
          actualResizeHandler();
          // The actualResizeHandler will execute at a rate of 15fps
        }, 66);
      }
    }
    function actualResizeHandler() {
      // handle the resize event

      var scaleX = window.innerWidth / 750;
      if (scaleX < 1) {
        $('#scaleContainer')
          .css('transform', 'scale(' + scaleX + ')')
          .show();
        $('.button, .placeNavMove').css({
          transform: 'scale(' + scaleX + ')'
        });
      } else {
        $('#scaleContainer').show();
        $('.button, .placeNavMove').css({
          'margin-left': (window.innerWidth - 750) / 2
        });
      }
    }
  })();

  function getNowTime() {
    var myDate = new Date();
    var d = {
      hour: myDate.getHours(),
      minutes: myDate.getMinutes()
    };
    return d;
  }

  var items = ['confirm', 'dead','suspect'];
  var newitems = ['confirm', 'suspect'];
  // var items = ['confirm', 'suspect', 'dead'];
  var colorHash = {
    confirm: '#BC423C',
    dead: '#66666C',
    suspect: '#F8D4A7',
    //治愈 曲线数据 在这里修改
    heal: '#178B50'
  };
  //新增颜色
  var newColorHash = {
    confirm: '#005DFF',
    suspect: '#F8D4A7',
    dead: '#178B50',
    heal: '#66666C'
  }
  //看这里
  /* ua 4 */
  var UA = function() {
    var userAgent = navigator.userAgent.toLowerCase();
    return {
      ipad: /ipad/.test(userAgent),
      iphone: /iphone/.test(userAgent),
      android: /android/.test(userAgent),
      qqnews: /qqnews/.test(userAgent),
      weixin: /micromessenger/.test(userAgent),
      qqnews_version: userAgent.match(/qqnews/i) == 'qqnews' ? userAgent.split('qqnews/')[1] : ''
    };
  };
  function provClick(data) {
    $('.areaShareLoading').show();
    setTimeout(() => {
      var __area = data.area;
      var $areaShare = $('.areaShare');
      // $areaShare.find('.bg').attr('crossorigin', 'anonymous');
      var areaBg = document.querySelector('.areaShare .bg');
      areaBg.crossOrigin = 'Anonymous';
      areaBg.crossOrigin = 'anonymous';
      $areaShare.find('.h1 .area, .h2 .area').text(__area);
      var $area = $(`.placeItemWrap[area="${__area}"]`);
      var __add = $area.find('.placeArea .add').text();
      var __confirm = $area.find('.placeArea .confirm').text();
      var __heal = $area.find('.placeArea .heal').text();
      var __dead = $area.find('.placeArea .dead').text();
      var $areaShare_data = $areaShare.find('.data');
      $('.areaShare .time').text($('.timeNum .d').text());
      $areaShare_data.find('.add').text(__add);
      $areaShare_data.find('.confirm').text(__confirm);
      $areaShare_data.find('.heal').text(__heal);
      $areaShare_data.find('.dead').text(__dead);
      var mapCanvas = document.querySelector('.chmap canvas');
      var $areaShareImg = $('.areaShare .dataMap img');
      if ($areaShareImg.length > 0) {
        $areaShareImg.attr('src', mapCanvas.toDataURL());
      } else {
        $('.areaShare .dataMap').prepend(`<img src="${mapCanvas.toDataURL()}" />`);
      }
      var tocanvasHtml = document.querySelector('.areaShare');
      var __canvas = document.createElement('canvas');
      var __width = tocanvasHtml.offsetWidth;
      var __height = tocanvasHtml.offsetHeight;
      var __scale = 2;
      __canvas.width = __width * __scale;
      __canvas.height = __height * __scale;
      __canvas.getContext('2d').scale(__scale, __scale);
      var opts = {
        tainttest: true, //检测每张图片都已经加载完成
        scale: __scale, // 添加的scale 参数
        useCORS: true,
        canvas: __canvas, //自定义 canvas
        logging: true, //日志开关
        width: __width, //dom 原始宽度
        height: __height //dom 原始高度
      };
      html2canvas(document.querySelector('.areaShare'), opts).then(function(canvas) {
        // console.log(canvas.toDataURL('image/jpeg'));
        var areaStirng = canvas.toDataURL('image/jpeg');
        if (bbo.isNewsApp()) {
          uoload64image(areaStirng);
        }
        $('.previw-img-area').attr('src', areaStirng);
        $('.bj-fixed-area').fadeIn();
        $('.areaShareLoading').hide();
        // eslint-disable-next-line no-invalid-this
        AppPlatform.Survey.Digg.digg(this, 23311878, 13575399, 27661344);
      });
    }, 100);
  }
  //数据加载完成后进行地图绘制
  function drawMap(provs) {
    // $el.empty();
    // 这里调用绘制地图方法
    let ary = [];
    let data = {};
    //素材数据上线改成https://mat1.gtimg.com/yslp/yyh5/mapview/
    data.path = 'https://mat1.gtimg.com/yslp/yyh5/mapview/';
    //本地运行 // ../
    // data.path = "../";
    //地图上显示的数据
    // console.log(ary.length, ary[0]);
    data.mapList = provs;
    data.div = {
      //页面传递一个容器
      id: 'chmap',
      //宽度
      width: 1500,
      //高度
      height: 1200
    };
    //对应的颜色 1000 100ren 10ren 1+ 0
    data.colors = ['#ED514e', '#FF8f66', '#FFB769', '#FFE6BE'];
    // new Main(data);
    new Main(data, provClick);
    // main.selectProv((res)=>{
    //   console.log(res);
    //   //在这里写执行命令
    //   console.log(11222)
    // });
  }
  function cloneObj(obj) {
    let newObj = {};
    if (obj instanceof Array) {
      newObj = [];
    }
    for (let key in obj) {
      let val = obj[key];
      //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。
      newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
    }
    return newObj;
  }
  function parseChinaMapData(data) {
    let ary = [];
    let totalData = {};
    let provName;
    data.map(function(d) {
      provName = d.area;
      if (totalData[provName]) {
        // console.log(provName,totalData[provName].confirm,d.city,d.confirm);
        totalData[provName].confirm += d.confirm;
      } else {
        totalData[provName] = cloneObj(d);
        ary.push(totalData[provName]);
        // console.log(provName,totalData[provName].confirm,d.city,d.confirm);
      }
    });
    // console.log(ary);
    drawMap(ary);
  }

  //绘制注意这个方法已经只绘制曲线图
  function map(dt) {
    let _data = dt;
    let data = _data.sort((a, b) => {
      const strA = a.date;
      const strB = b.date;
      return strA < strB ? 1 : -1;
    });
    let data2=cloneObj(data);
    let grid={
      left: '2%',
      right: '2%',
      bottom: '2%',
      top: '2%',
      containLabel: true
    };
    // 画折线图
    var drawChart = function(container, data) {
      $(container).empty();
      var $chart = $('<div class="chart"></div>').appendTo($(container));
      data = data.slice().sort(function(a, b) {
        return a.date > b.date ? 1 : -1;
      });
      // data.pop();
      data.map(function(v) {
        for (key in v) {
          if (!v[key]) v[key] = null;
        }
      });
      
      var myChart = echarts.init($chart[0]);
      option = {
        grid: grid,
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: { fontSize: 20, color: '#595757' },
          boundaryGap: ['30%', '30%'],
          axisTick: { show: false },
          data: data.map(function(d) {
            return d.date;
          })
        },
        yAxis: {
          type: 'value',
          axisLabel: { fontSize: 20, color: '#595757' },
          axisLine: { show: false },
          axisTick: { show: false },
          minInterval: 1, //会出现负数刻度
          min: 0,
        },
        series: items.map(function(d) {
          return {
            name: d,
            type: 'line',
            // smooth:true,
            symbolSize: 10,
            lineStyle: { width: 4 },
            itemStyle: { color: colorHash[d] },
            // stack: '总量',
            data: data.map(function(da) {
              return da[d];
            })
          };
        })
      };
      myChart.setOption(option);
    };
    //疫情趋势地图
    var drawChart2 = function(container, data) {
      $(container).empty();
      var $chart = $('<div class="chart"></div>').appendTo($(container));
      data = data.slice().sort(function(a, b) {
        return a.date > b.date ? 1 : -1;
      });
      // data.pop();
      let curData;
      let lastData;
      let newAry=[];
      for(let i=0;i<data.length;i++){
        curData=data[i];
        if(i==0){
          newAry.push(curData);
          continue;
        }  
        lastData=data[i-1];
        let newData={};
        // console.log(curData,lastData);
        for(let key in curData){
          newData["date"]=curData.date;
          if(key != "date"){
            if(parseInt(curData[key]) < parseInt(lastData[key])){
              newData[key]=parseInt(curData[key]);
            }else{
              newData[key]=parseInt(curData[key])-parseInt(lastData[key]);
            }
          }
        }
        newAry.push(newData);
      }
      data=newAry;
      console.log(data);
      console.log(newAry);
      // data.map(function(v) {
      //   for (key in v) {
      //     if (!v[key]) v[key] = null;
      //   }
      // });
      var myChart = echarts.init($chart[0]);
      option = {
        grid:grid,
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: { fontSize: 20, color: '#595757' },
          boundaryGap: ['30%', '30%'],
          axisTick: { show: false },
          data: data.map(function(d) {
            return d.date;
          })
        },
        yAxis: {
          type: 'value',
          axisLabel: { fontSize: 20, color: '#595757' },
          axisLine: { show: false },
          axisTick: { show: false },
          minInterval: 1, //会出现负数刻度
          min: 0,
        },
        series: newitems.map(function(d) {
          return {
            name: d,
            type: 'line',
            // smooth:true,
            symbolSize: 10,
            lineStyle: { width: 4 },
            itemStyle: { color: newColorHash[d] },
            // stack: '总量',
            data: data.map(function(da) {
              return da[d];
            })
          };
        })
      };
      myChart.setOption(option);
    };
    // console.log(chia)
    drawChart($('.china'), data);
    // drawChart2($('.china2'), data2);
    // nav
    $('#moveNav').html($('#staticNav').html());
    $('.placeNavMove').html($('#placeNav').clone());
    $('body').on('click', '.navTab', function() {
      var type = $(this).data('id');
      highlightNav(type);
    });
    var $navTabs = $('.navTabs');
    var highlightNav = function(type) {
      $navTabs.find('.navTab').removeClass('active');
      $navTabs.find('.navTab.' + type + 'Tab').addClass('active');
    };
    // IntersectionObserver
    var io = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(i) {
          if (i.target.id === 'staticNav') {
            if (i.intersectionRatio >= 0.99) {
              $('#moveNav').hide();
            } else {
              $('#moveNav').show();
            }
          }
        });
      },
      {
        threshold: [0, 0.5, 1]
      }
    );
    io.observe(document.querySelector('#staticNav'));

    var io2 = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(i) {
          if (i.target.id === 'charts') {
            if (i.intersectionRatio > 0) {
              highlightNav('charts');
            }
          }
        });
      },
      {
        threshold: [0, 0.1],
        rootMargin: -window.innerHeight / 2.2 + 'px 0px'
      }
    );
    io2.observe(document.querySelector('#charts'));

    var io3 = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(i) {
          if (i.target.id === 'prevent') {
            if (i.intersectionRatio > 0) {
              highlightNav('prevent');
            }
          }
        });
      },
      {
        threshold: [0],
        rootMargin: -window.innerHeight / 2.2 + 'px 0px'
      }
    );
    io3.observe(document.querySelector('#prevent'));

    var io4 = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(i) {
          if (i.target.id === 'news') {
            if (i.intersectionRatio > 0) {
              highlightNav('news');
            }
          }
        });
      },
      {
        threshold: [0],
        rootMargin: -window.innerHeight / 2.2 + 'px 0px'
      }
    );
    io4.observe(document.querySelector('#news'));

    var io5 = new IntersectionObserver(
      function(entries) {
        entries.forEach(function(i) {
          if (i.target.id === 'rumor') {
            if (i.intersectionRatio > 0) {
              highlightNav('rumor');
            }
          }
        });
      },
      {
        threshold: [0],
        rootMargin: -window.innerHeight / 2.2 + 'px 0px'
      }
    );
    io5.observe(document.querySelector('#rumor'));
  }

  // 新的绘制省份列表数据的方法
  function drawArea (obj) {
    var __data = obj.data.total;
    __data = __data.sort(function(a, b) {
      if (a.confirm !== b.confirm) {
        return parseInt(b.confirm) - parseInt(a.confirm);
      } else {
        return parseInt(b.suspect) - parseInt(a.suspect);
      }
    });
    function __draw () {
      __data.map(function(d){
        var _html = $(`
          <div class="placeItemWrap ${d.area == '湖北' ? 'current' : ''}" area="${d.area}">
            <div class="clearfix placeItem placeArea">
              <h2 class="blue">${d.area}</h2>
              <div class="add ac_add">${d.today.confirm == 0 ? '-' : d.today.confirm}</div>
              <div class="confirm">${d.confirm}</div>
              <div class="heal">${d.heal}</div>
              <div class="dead">${d.dead}</div>
            </div>
          </div>
        `);
        obj.el.append(_html);
        _html.find('.placeArea').click(function(){
          $(this).closest('.placeItemWrap').toggleClass('current');
        });
      });
    }
    setTimeout(function() {
      __draw();
      obj.cb();
    },100);
  }

  // 新的绘制二级地区列表数据的方法
  function drawCitys (data) {
    var __data = data.total;
    __data = __data.sort(function(a, b) {
      if (a.confirm !== b.confirm) {
        return b.confirm - a.confirm;
      } else {
        return b.suspect - a.suspect;
      }
    });
    __data.map(function(dd){
      var $_closestDom = $('.placeItemWrap[area="' + dd.area + '"]');
      var _innerhtml = `
        <div class="clearfix placeItem placeCity" city="${dd.city}">
          <h2 ${dd.city.length > 5 ? 'class="small"' : ''}>${dd.city}</h2>
          <div class="ac_add">${dd.today.confirm == 0 ? '-' : dd.today.confirm}</div>
          <div>${dd.confirm}</div>
          <div>${dd.heal}</div>
          <div>${dd.dead}</div>
        </div>
      `;
      $_closestDom.append(_innerhtml);
    })
  }

  // 绘制海外表格
  function mapOthData($el, data) {
    var __data = data.sort(function(a, b) {
      if (a.confirm !== b.confirm) {
        return b.confirm - a.confirm;
      } else {
        return b.suspect - a.suspect;
      }
    });
    var __hw_confirm = 0;
    var __hw_dead = 0;
    var $hw_confirm = $('.hw_confirm');
    var $hw_dead = $('.hw_dead');
    __data.map(function(d) {
      var _html = '';
      __hw_confirm += parseInt(d.confirm);
      __hw_dead += parseInt(d.dead);
      var _html = `
        <div class="clearfix placeItem placeArea no-sharp abroad" country="${d.country}">
          <h2 class="blue ${d.country.length > 3 ? 'small' : ''}">${d.country}</h2>
          <div>${d.confirm}</div>
          <div>${d.heal}</div>
          <div>${d.dead}</div>
        </div>
      `;
      $el.append(_html);
    });
    $hw_confirm.text(__hw_confirm);
    $hw_dead.text(__hw_dead);
  }
  
  var $head_confirm = $('.recentNumber .confirm .number'),
      $head_suspect = $('.recentNumber .suspect .number'),
      $head_cure = $('.recentNumber .cure .number'),
      $head_dead = $('.recentNumber .dead .number'),
      $head_time_d = $('.timeNum .d')
      ;
  // 绘制顶部信息（确诊新增...，截至...，）
  function updateHead(headData) {
    // 确诊
    $head_confirm.html(headData.confirm);
    // 疑似
    $head_suspect.html(headData.suspect);
    // 治愈
    $head_cure.html(headData.heal);
    // 死亡
    $head_dead.html(headData.dead);
    $head_time_d.html('截至 ' + headData.lastUpdateTime);
  }

  // 绑定事件
  function addFunction () {
    var $pop_qs = $('.pop_qs');
    var $qs_mask = $('.qs_mask');
    $('.ac-dataqs').click(function() {
      $pop_qs.show();
      $qs_mask.show();
    });
    $('.ac_qs_close, .ac_qs_mask').click(function() {
      $pop_qs.hide();
      $qs_mask.hide();
    });
    var $placeNav = $('#placeNav');
    var $placeNavMove = $('.placeNavMove');
    var placeNavTop = $placeNav.offset().top;
    var $window = $(window);
    $window.scroll(function() {
      if ($window.scrollTop() > placeNavTop) {
        if ($('.dataTips').length > 0 && $window.scrollTop() < $('.dataTips').offset().top) {
          $placeNavMove.show();
        }
      } else {
        $placeNavMove.hide();
      }
      if (
        $('.dataTips').length > 0 &&
        $window.scrollTop() > $('.dataTips').offset().top - 120
      ) {
        $placeNavMove.hide();
      }
    });
    $('.dataMap')
      .append($('.chinamapLegend1').clone())
      .append($('.chinamapLegend2').clone());
    $('.tabclose-area').click(function() {
      $('.bj-fixed-area').fadeOut();
    });
    var ua = UA();
    if (ua.android) {
      $('.areaShare').addClass('android');
    }
  }


  // 获取新接口数据
  function getList () {
    $.ajax({
      url: 'https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5',
      dataType: 'jsonp',
      scriptCharset: 'UTF-8',
      jsonp: 'callback',
      success: (res) => {
        var data = JSON.parse(res.data);
        var headData = {}
        // 所有数据都通过深度拷贝后传递
        // 顶部全局数据
        for(var i in data.chinaTotal){
          headData[i] = data.chinaTotal[i]
        }
        headData.lastUpdateTime = data.lastUpdateTime;
        updateHead(headData);

        // 曲线数据
        var lineData = [];
        for (var i in data.chinaDayList) {
          lineData.push(data.chinaDayList[i]);
        }
        map(lineData);
        // 国内数据 国外数据
        // var dataCn = [];
        var areaData = {
          total: [],
          today: [],
        };
        var cityData = {
          total: [],
          today: [],
          mapTotal: [],
        };
        var foreignArray = [];
        for (var i in data.areaTree) {
          var item = data.areaTree[i];
          if (item.name == '中国') {
            // console.log('中国')
            for (var n in item.children) {
              // console.log('totle_nnnnnn', item.children[n])
              // var __this
              var __total = {}
              var __today = {}
              __total = Object.assign({}, item.children[n].total);
              __today = Object.assign({}, item.children[n].today);
              __total.area = item.children[n].name;
              if (item.children[n].children && item.children[n].children.length > 0) {
                for (var totle_i in item.children[n].children) {
                  var __citytotal = {}
                  var __cityMapTotal = {}
                  var __citytoday = {}
                  __citytotal = Object.assign({}, item.children[n].children[totle_i].total);
                  __citytoday = Object.assign({}, item.children[n].children[totle_i].today);
                  __citytotal.area = item.children[n].name;
                  __citytotal.country = item.name;
                  __citytotal.city = item.children[n].children
                  [totle_i].name;
                  __cityMapTotal = Object.assign({}, __citytotal);
                  cityData.mapTotal.push(__cityMapTotal);
                  __citytotal.today = __citytoday;
                  // console.log('totle_i', item.children[n].children[totle_i])
                  cityData.total.push(__citytotal);
                }
              }
              // console.log('__d',__d)
              __total.today = __today;
              areaData.total.push(__total);
            }
          } else {
            var __country = {};
            for (var n in item.total) {
              __country[n] = item.total[n];
              __country[n].doday = item.today;
            }
            // console.log(typeof __country)
            __country.country = item.name;
            __country.city = '';
            __country.area = '';
            foreignArray.push(__country);
            // console.log('forignArry', foreignArray)
          }
        }
        // console.log('forignArry', foreignArray)

        // areaMap();
        addFunction();
        parseChinaMapData(cityData.mapTotal);
        drawArea({
          el: $('.chianList'),
          data: areaData,
          cb: function() {
            drawCitys(cityData)
          }
        });
        // drawCitys(cityData);
        if (foreignArray.length > 0) {
          mapOthData($('.abroadList'), foreignArray);
        }
      },
      error: (err) => {
        console.log(err)
      }
    });
  }
  getList();
});

// //医疗门诊省份接口请求
// $.ajax({
//   url: 'https://wechat.wecity.qq.com/api/THPneumoniaService/getHospitalProvince',
//   type: 'POST',
//   contentType:'application/json;charset=utf-8',
//   data:JSON.stringify({
//     service:'THPneumoniaOuterService',
//     args:{req:{}},
//     func:'getHospitalProvince',
//     context:{channel:'AAEEviDRbllNrToqonqBmrER'},
//   }),
//   success: function(res) {
//     if(res.args.rsp.result.code == 0){
//       let provincesList = res.args.rsp.provinces;
//       mapHealthProvinceData($('.div-hospital'), provincesList);
//     }  
//   }
// });
// //医疗门诊城市接口请求
// function cityRequest($cur,province) {
//   $.ajax({
//     url: 'https://wechat.wecity.qq.com/api/THPneumoniaService/getHospitalCityByProvince',
//     type: 'POST',
//     contentType:'application/json;charset=utf-8',
//     data:JSON.stringify({
//       service:'THPneumoniaOuterService',
//       args:{req:{
//         "province": province
//       }},
//       func:'getHospitalCityByProvince',
//       context:{channel:'AAEEviDRbllNrToqonqBmrER'},
//     }),
//     success: function(res) {
//       if(res.args.rsp.result.code == 0){
//         mapHealthCity($cur,res.args.rsp.info.citys);
//       }
//     }
//   });
// }
// //拼接医疗门诊省份
// function mapHealthProvinceData($el, list) {
//   $el.empty()
//   list.map(function(d) {
//     var _html = '';
//     var _html = $(`
//       <div class="hotelItemWrap" province="${d.provinceName}">
//         <div class="hotelProvince" data-province="${d.provinceName}" data-count="${d.cityCnt}">
//           <div class="name">${d.provinceName}</div>
//           <div class="count">${d.cityCnt}市</div>
//         </div>
//       </div>
//     `);
//     $el.append(_html);
//     _html.find('.hotelProvince').click(function(e){
//       let province = e.currentTarget.dataset.province;
//       let count    = e.currentTarget.dataset.count;
//       let cCount   = $(this).parent().children('.hotelCity').length;
//       if(cCount == 0 && count != 0){
//         cityRequest($(this),province);
//       }
//       $(this).closest('.hotelItemWrap').toggleClass('current');
//     });
//   });
//   $el.children('.hotelItemWrap')
//   .first()
//   .children()
//   .trigger('click');
// }
// //拼接医疗门诊城市
// function mapHealthCity($el, list) {
//   var _html = '';
//   list.map(function(d) {
//     _html =  $(`
//         <div class="hotelCity">
//           <div class="name">${d.cityName}</div>
//           <div class="count">${d.count}家</div>
//           <a class="healthlink" href="${d.link.url}"/>
//         </div>
//     `);
//     $el.parent().append(_html);
//     // $el.parent().find('.hotelCity').click(function(){
//     //   console.log('----跳转地址',d.link.url);
//     //   window.location.href=d.link.url;
//     // });
//   });
// }
