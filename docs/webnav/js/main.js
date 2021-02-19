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
            config:{
              logo_img: true,
              logo_img_url:"https://cdn.jsdelivr.net/gh/medfav/MyPage/docs/webnav/img/logo.png",
              logo_text: "网址导航",
              data_source: "https://mockapi.eolinker.com/wMcT8EC5b9622df7c09ace9bd4ad3cde87932fd5b8344a4/data/tabs.json",
              default_search:"baidu",
              search_config:[]
            },
            config_url: "https://mockapi.eolinker.com/wMcT8EC5b9622df7c09ace9bd4ad3cde87932fd5b8344a4/data/config.json",
            activeName: ['g1t1','g2t1'],
            // all_items: [],
            // group_items: [],
            // tab_items: [],
            tab_groups: [],
            searchbox_value:""
          };
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
        //bing搜索建议jsonp回调函数
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
      searchButton:function(search_engines) {
          // document.querySelector(".el-autocomplete .el-input input").value;
          console.log(this.searchbox_value);
          let searchurl = "";
          this.config.search_config.forEach((item)=>{
            if(item.id==search_engines){
              searchurl = item.queryUrl.replace(/{}/g,encodeURIComponent(this.searchbox_value));
              if(searchurl!=""){
                window.open(searchurl,"_blank");
              }
            }
          })
        }
    },
    mounted: function() {
      // axios.get("/data/data.json")
      // .then(response => {
      //   this.tab_items = response.data;
      // })
      axios.get(this.config_url,{
        "Content-Type":"application/json; charset=UTF-8"
      })
      .then(response => {
        const config = response.data;
        this.config.logo_img = config.logo_config.logo_img;
        this.config.logo_img_url = config.logo_config.logo_img_url;
        this.config.logo_text = config.logo_config.logo_text;
        // this.config.data_source = config.data_source;
        this.config.search_config = config.search.search_list;
        this.config.default_search = config.search.default_search
      });
      axios.get(this.config.data_source)
      .then(response => {
        this.tab_groups = response.data;
      });
      // axios.get("https://mockapi.eolinker.com/wMcT8EC5b9622df7c09ace9bd4ad3cde87932fd5b8344a4/data/tabs.json")
      // .then(response => {
      //   this.tab_groups = response.data;
      // })
    }
  };
var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')
