var Cloze = function(text, cloze) {
    this.text = text;
 //clean up this.cloze -> it breaks here.   
    this.cloze = this.text.match(/\(([^)]+)\)/)[1];
    this.printCloze = function() {
        console.log(this.cloze);
    }
    this.printText = function() {
        console.log(this.text);
    }
    this.message = this.text.replace('(' + this.cloze + ')', '____');
}
Cloze.prototype.printAnswer = function() {
    console.log('Oops! Here is the full sentence: \n' + this.text.replace(/[{()}]/g, ''));
}
module.exports = Cloze;