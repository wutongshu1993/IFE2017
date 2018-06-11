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

    console.log(this);
    var val;
    for (var key in obj) {
        //这里需要进行深度递归对每个属性都进行监听
        // console.log(key);

        if (typeof obj[key] === 'object') {
            /////为啥这样不起作用呢
            this.walk(obj[key]);
        }

        if (obj.hasOwnProperty(key)) {
            val = obj[key];
            if (typeof val === 'object') {
                new Observer(val);
            }
            this.convert(key, val); //依次给所有属性设置get和set函数。
        }
    }
};
p.convert = function (key, val) {
    var self = this;
    Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            console.log("你访问了" + key);
            return val;
        },
        set: function (newVal) {
            //如果是在data下的address的city进行设置，这里的emit不会起作用。
            console.log("你设置了" + key + ' = ' + newVal);
            if (newVal === val) {
                return;
            };
            self.eventBus.emit(key, val, newVal); //执行函数
            val = newVal;
            if (typeof newVal === 'object') {
                new Observer(newVal); //如果新设置的值为对象，为新对象绑定。
            }
        }
    });
};
p.$watch = function (attr, callback) {
    this.eventBus.on(attr, callback);
};

function PubSub() {
    this.handlers = {};
}
PubSub.prototype = {
    on: function (eventType, handler) {
        var self = this;
        if (!(eventType in self.handlers)) {
            self.handlers[eventType] = [];
        }
        self.handlers[eventType].push(handler);
        return this;
    },
    emit: function (attr, val, newVal) {
        //执行已经注册的函数，函数在set的时候调用emit。在watch中进行绑定
        var self = this;
        if (self.handlers[attr]) {
            self.handlers[attr].forEach(function (item) {
                item(val, newVal);
            });
        }
    }
};

var app2 = new Observer({
    major: 'computer',
    address: {
        country: 'china',
        city: 'chengdu'
    }
});

app2.$watch('city', function () {
    console.log('city发生改变了');
});
app2.data.address.city = 'dl';
// console.log(app2.data.address.city);

//# sourceMappingURL=vueObserve-compiled.js.map