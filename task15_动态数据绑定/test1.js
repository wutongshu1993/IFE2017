/**
 * Created by lh on 2017/3/6.
 */
var book = {
    _year : 2009,
    edition: 1
}
Object.defineProperty(book, "year", {
    get: function () {
        console.log("访问了year"+this._year);
        return this._year;
    },
    set : function (newValue) {
        console.log("设置了year"+newValue);
        this._year = newValue;
        this.edition = newValue - 2009
    }
});
var t = book.year;
book.year = 2015;
console.log(book.edition);
