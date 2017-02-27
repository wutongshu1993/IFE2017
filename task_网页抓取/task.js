/**
 * Created by lh on 2017/2/27.
 */
var page = require('webpage').create(),
    system  = require('system'),
    address,
    params,
    dataList = [],
    result = null,
    startTime = Date.now();
if(system.args.length === 1){
    console.log('usage: load finished');
    phantom.exit();
}
address = system.args[1];
params = system.args[2];
address += '/s?wd='+params;

phantom.outputEncoding = "gbk";
page.open(address, function (status) {
    if(status === 'success'){
        page.includeJs('../jquery-3.1.0.js', function () {
          dataList = page.evaluate(function () {
              var data = [];
              var $content = $('.c-container');
              $content.each(function (index) {
                  data[index] = {
                      title : $(this).find('.t').text() || '',
                      link : $(this).find('.c-showurl').text() || '',
                      info: $(this).find('.c-abstract').text() || '',
                      pic: $(this).find('.general_image_pic img').attr('src') || ''
                  }
              });
              return data;
          });
          result = {
              code : 1,
              keyword: params,
              msg : '抓取成功',
              time : Date.now() - startTime,
              dataList : dataList
          }
          console.log(JSON.stringify(result, null , 4));
            phantom.exit();
        });
    }
    else {
        result = {
            code : 0,
            keyword: params,
            msg : '抓取失败',
            time : Date.now() - startTime,
            dataList : dataList
        }
        console.log(JSON.stringify(result, null , 4));
        phantom.exit();
    }
    /*page.evaluate(function () {
     var keys = document.getElementById("kw");
     keys.value = params;
     var btn = document.getElementById('su');
     var client_rect = btn.getBoundingClientRect();
     btn.addEventListener('click', function () {
     console.log(2222);
     });
     page.sendEvent('click', client_rect.left+3+'px', client_rect.top+3+'px');
     // page.sendEvent('click', page.event.key.Enter);//模拟按下回车
     });*/
});
