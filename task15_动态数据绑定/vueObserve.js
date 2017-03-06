/**
 * Created by lh on 2017/3/6.
 */
function Observer(data) {
    this.data = data;
    this.walk(data);
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
            val = newVal;
        }
    })
};
var data = {
    user : 'lily',
    age : 22
};
var app = new Observer(data);
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
app.data.user = 'mi';
var t = app.data.user;
app1.data.name // 你访问了 name
app.data.age = 100;  // 你设置了 age，新的值为100
app2.data.university // 你访问了 university
app2.data.major = 'science'  // 你设置了 major，新的值为 science
app2.data.address;



