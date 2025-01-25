const videoID = require('./videoID.json')
function list() {
    var z = [];
    const list_mas = [];
    for (i in videoID.anime){
        z.push(`${ parseInt(i, 10) + 1}.Название: ${videoID.anime[i].name}`);
        if(videoID.anime.length < 3) {
            list_mas.push(z)
        }
        if (z.length === 3 || i === videoID.anime.length - 1){
            list_mas.push(z)
            z = []
        }
    }
    return list_mas
}
var aue = list()
console.log(aue) 