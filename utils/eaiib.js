const request = require('axios');


function download(url){
    let date = new Date();
    return request.get(url, {
        params: {
            start: `${date.getFullYear()-1}-01-01`,
            end: `${date.getFullYear()+1}-01-31`
        }
    })
}

function parse(eaiibCourseItems) {
    return eaiibCourseItems
        .data
        .map(i => {
            let title = parseTitleField(i.title);
            let x = title.length-1;
            return {
                name: title[0].trim(),
                lecturer: (title[x]+title[x-1]).trim(),
                group: i.group.toString().replace('.1', 'a').replace('.2', 'b'),
                place: title[x-2].trim(),
                courseDetails: [{
                    start: i.start,
                    end: i.end
                }]
            }
        })
        .reduce(
            (plan, item) => {
                const k = key(item);
                if(plan.get(k)){
                    let collectedDetails = plan.get(k).courseDetails;
                    collectedDetails = collectedDetails.concat(item.courseDetails)
                    item.courseDetails = collectedDetails
                }

                return plan.set(k, item)
            },
            new Map())
}

function parseTitleField(it){
    if(it.includes("Informacja")){
        it = it.substring(0, it.indexOf("Informacja"))
    }

    it = it
        .replace(/<br\/>/g, ',')
        .replace('prowadzący: ', '')
        .replace('Sala: ', '')
        .split(',');

    return it
}

function key(obj){
    return `${obj.name}&&&${obj.group}`
}


module.exports= url => download(url).then(res => parse(res).values());