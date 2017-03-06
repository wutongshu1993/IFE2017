/**
 * Created by lh on 2017/3/6.
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
            val = newVal;
            if(typeof newVal === 'object'){
                new Observer(newVal);//如果新设置的值为对象，为新对象绑定。
            }
        }
    })
};
p.$watch = function (attr, callback) {
this.eventBus.on(attr, callback);
};

function PubSub() {
    this.handlers = {};
}
PubSub.prototype = {
    on : function (eventType, handler) {
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



var app1 = new Observer({
    name: 'youngwind',
    age: 25
});

var app2 = new Observer({
    university: 'bupt',
    major: 'computer',
    address:{
        country: 'china',
        city : 'chengdu'
    }
});

app2.data.address.country;
app2.data.address.country = 'usa';
app1.data.name = {
    job: "前端"
};
app1.data.name.job = '后台';
app1.$watch('age', function (age, newval) {
    console.log('我的年纪变了，现在已经是'+newval+'岁了');
});
app1.$watch('age', function (age, newval) {
    console.log('我的年纪变了，长大了'+parseInt(newval-age)+'岁');
});
app1.data.age = 100;



