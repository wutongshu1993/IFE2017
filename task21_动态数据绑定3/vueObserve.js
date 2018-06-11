/**
 * Created by lh on 2017/3/8.
 */
function Observer(data) {
    this.data = data;
    this.walk(data);
    this.eventBus = new PubSub();
}
var p = Observer.prototype;
p.walk = function (obj) {
    var val;
    for(var key in obj){

        if(obj.hasOwnProperty(key)){
            val = obj[key];
            if(typeof val === 'object'){
                new Observer(val);
            }
            this.convert(key, val);//依次给所有属性设置get和set函数。
        }
    }
};
p.convert = function (key, val) {
    var self = this;
    Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            console.log("你访问了"+ key);
            return val;
        },
        set : function (newVal) {
            console.log("你设置了"+key+' = '+newVal );
            if(newVal === val){return };
            self.eventBus.emit(key, val, newVal);//执行函数
            //这里需要依次向上进行触发

            val = newVal;
            if(typeof newVal === 'object'){
                new Observer(newVal);//如果新设置的值为对象，为新对象绑定。
            }
        }
    })
};
p.$watch = function (attr, callback) {
    var self = this;
    console.log(attr);
    if (typeof self.data[attr] === 'object') {
        for (let key in self.data[attr]) {
            // this.$watch(key, callback);
            self.eventBus.on(key, callback);
            // console.log(this.eventBus.handlers);
        }
    }

    self.eventBus.on(attr, callback);


}
function PubSub() {
    this.handlers = {};
}
PubSub.prototype = {
    on : function (eventType, handler) {//注册监听事件
        var self = this;
        if(!(eventType in self.handlers)) {
            self.handlers[eventType] = [];
        }
        self.handlers[eventType].push(handler);
        return this;
    },
    emit : function (attr, val, newVal) {//执行已经注册的函数，函数在set的时候调用emit。在watch中进行绑定
        var self = this;
        if(self.handlers[attr]){
            self.handlers[attr].forEach(function (item) {
                item(val, newVal);
            })
        }
    }
}

var app2 = new Observer({
    university: 'bupt',
    major: 'computer',
    address:{
        country: 'china',
        city : 'chengdu'
    }
});


app2.$watch('address', function(old, newaddress){
    console.log('我的地址变了');
});
// app2.data.address = {country:'hk',city:'cd'};
app2.data.address.city = 'dl';



