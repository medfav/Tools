// new Vue({
//     el: '#app',
//     data: function() {
//         return {
//              visible: false 
//         }
//     }
// })
var Main = {
    data() {
        // const item = {
        //     activeName: '2016-05-02'
        // };
        return {
            config_info:{},
            config:{
              logo_img: true,
              // logo_img_url:"./img/logo.png",
              logo_img_url:"https://cdn.jsdelivr.net/gh/medfav/MyPage@master/docs/webnav/img/logo.png",
              logo_text: "网址导航",
              // data_source: "./data/tabData/tabs_framework.json",
              data_source: "https://mockapi.eolink.com/wMcT8EC5b9622df7c09ace9bd4ad3cde87932fd5b8344a4/data/tabs_framework.json",
              // data_source: "https://mockapi.eolink.com/wMcT8EC5b9622df7c09ace9bd4ad3cde87932fd5b8344a4/data/tabs.json",
              // config_url: "./data/config.json",
              config_url: "https://mockapi.eolink.com/wMcT8EC5b9622df7c09ace9bd4ad3cde87932fd5b8344a4/data/config.json",
              default_search:"baidu",
              search_config:[],
            },
            load_info:"正在加载数据......",
            // activeName: ['g1t1','g2t1'],
            // all_items: [],
            // group_items: [],
            // tab_items: [],
            source_info:{},
            tab_groups: [],
            other_config: {
              // 值为set-gray时，全页面置为黑白
              set_gray: "set-gray",
              keywords: {
                words: ["NjQ5N2Y4Y2ViYTczY2ZmZjM0NDA5Y2M5YzRjYjdhYjM=", "ODliMmM2MTA4MzQ5NzFhZTcyMWU2ZGIyYjczZjEyM2M="],
                target: ["../mg", "../mg"]
              }
            },
            copyright: {
              dates: "2020-2024",
              domain: "www.medfav.com",
              author_or_owner: "蓝天之约" 
            },
            searchbox_value:""
          };
    },
    watch: {
      tab_groups: function() {
        // this.getGroupData(this.tab_groups);
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      querySearch:(queryString, cb) => {
        // bing搜索建议
        $.ajax({
          url: "https://api.bing.com/qsonhs.aspx?type=cb&q=" + queryString + "&cb=window.bing.sug",
          type: "GET",
          dataType: "jsonp"
        })
        // bing搜索建议jsonp回调函数
        window.bing = {"sug":(bing_sug) => {
          console.log(bing_sug);
          let suggest_list = [{"value":bing_sug.AS.Query}];
          if(bing_sug.AS.FullResults > 0){
            bing_sug.AS.Results[0].Suggests.forEach(element => {
              suggest_list.push({"value":element.Txt});
            });
          }
          console.log(suggest_list);
          // 调用 callback 返回建议列表的数据
          cb(suggest_list);
        }};
      },
      handleSelect:function (item){
        console.log(item);
        this.searchButton(this.config.default_search);
      },
      // 搜索按钮功能
      searchButton:function(search_engines) {
          // document.querySelector(".el-autocomplete .el-input input").value;
          console.log(this.searchbox_value);
          if ( this.searchbox_value.charAt(0) === "@") {
          // if( == this.other_config.keywords[0] || this.searchbox_value == this.other_config.keywords[1]) {
            let index = this.other_config.keywords.words.indexOf(md5(this.searchbox_value.slice(1)))
            if (index >= 0){
              window.open(this.other_config.keywords.target[index]);
              return
            }
          }
          let searchurl = "";
          this.config.search_config.forEach((item)=>{
            if(item.id==search_engines){
              searchurl = item.queryUrl.replace(/{}/g,encodeURIComponent(this.searchbox_value));
              if(searchurl!=""){
                window.open(searchurl,"_blank");
              }
            }
          })
        },
        // 判断是不是json格式
        isJSON:function(str) {
            if (typeof str == 'object'){
                console.log('It is not a Object!');
                return true;
            }
            if (typeof str == 'string') {
                try {
                    var obj=JSON.parse(str);
                    if(typeof obj == 'object' && obj ){
                        console.log('It is a JSON!');
                        return true;
                    }else{
                        console.log('It is not a JSON!');
                        return false;
                    }
                } catch(e) {
                    console.log('error：JSON格式错误！');
                    return false;
                }
            }
            console.log('It is not a string!');
            return false;
        },
        // 获取配置信息
        getConfig: function(config_url) {
          axios.get(config_url,{
            "Content-Type":"application/json; charset=UTF-8"
          })
          .then(response => {
            if(!this.isJSON(response.data)){
                console.log("配置文件错误!");
                this.load_info = "配置文件错误!";
                return;
            }
            const config = typeof response.data == "string"?JSON.parse(response.data):response.data;
            this.config_info = config.config_info;
            console.log("配置数据版本：" + config.config_info.data_version + ", 更新日期：" + config.config_info.change_date);
            this.config.logo_img = config.logo_config.logo_img;
            this.config.logo_img_url = config.logo_config.logo_img_url;
            this.config.logo_text = config.logo_config.logo_text;
            // this.config.data_source = config.data_source;
            this.config.search_config = config.search.search_list;
            this.config.default_search = config.search.default_search;
            // 设置灰色
            this.other_config.set_gray = config.other_config.set_gray;
            // 默认关键词
            this.other_config.keywords = this.decodeText(config.other_config.keywords);
            // 版权信息
            this.copyright.dates = config.copyright.dates;
            this.copyright.domain = config.copyright.domain;
            this.copyright.author_or_owner = config.copyright.author_or_owner;
          });
        },
        // 获取页面框架信息
        getTabFrameworkData: function(data_source) {
          axios.get(data_source)
          .then(response => {
            if(!this.isJSON(response.data)){
                console.log("数据文件错误!");
                this.load_info = "数据文件错误!";
                return;
            }
            let res_data = typeof response.data == "string"?JSON.parse(response.data):response.data;
            this.source_info = res_data.source_info;
            console.log("导航数据版本：" + res_data.source_info.data_version + ", 更新日期：" + res_data.source_info.change_date);
            this.tab_groups = res_data.nav_data;
            this.getGroupData(this.tab_groups);
          });
        },
        // 根据框架数据，获取分组数据
        getGroupData: function(tab_groups) {
          tab_groups.forEach((group, index)=>{
            axios.get(group.data_url, {
              params: {
                idx: index + 1
              }
            })
            .then(response => {
              if(!this.isJSON(response.data)){
                  console.log("数据文件错误!");
                  this.load_info = "数据文件错误!";
                  return;
              }
              console.log(response.config.params);
              let res_data = typeof response.data == "string"?JSON.parse(response.data):response.data;
              // let group = tab_groups.find(group => group.group_id == res_data.group_id);
              // group.tabs = res_data.tabs;
              for (i = 0; i < tab_groups.length; i++) {
                if (tab_groups[i].group_id == res_data.group_id) {
                  // tab_groups[i] = res_data;
                  // 改变数组元素，直接通过下标修改不会被监听
                  this.$set(tab_groups, i, res_data);
                }
                
              }
              this.tab_groups;
              // tab_groups[1].tabs = res_data.tabs;
            });
          })
        },
        decodeText: function(keywords){
          // 解码
          keywords.words = keywords.words.map(item => {
            return window.atob(item);
          });
          return keywords;
        }
    },
    mounted: function() {
      // axios.get("/data/data.json")
      // .then(response => {
      //   this.tab_items = response.data;
      // })
      // 获取配置信息
      this.getConfig(this.config.config_url);
      // 页面获取框架信息
      this.getTabFrameworkData(this.config.data_source);
      // axios.get("https://mockapi.eolink.com/wMcT8EC5b9622df7c09ace9bd4ad3cde87932fd5b8344a4/data/tabs.json")
      // .then(response => {
      //   this.tab_groups = response.data;
      // })
    }
  };
var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')
