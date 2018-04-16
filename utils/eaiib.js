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
            let title = parseTitleField(i.title)
            return {
                name: title[0],
                group: i.group.toString().replace('.1', 'a').replace('.2', 'b'),
                other: title[1],
                courseDetails: [{
                    start: i.start.toLocaleString(),
                    end: i.end.toLocaleString()
                }]
            }
        })
        .reduce(
            (plan, item) => {
                const k = key(item);
                if(plan.get(k)){
                    let collectedDetails = plan.get(k).courseDetails;
                    collectedDetails = collectedDetails.concat(item.courseDetails);
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

    return it
        .replace(/<br\/>/g, ',')
        .split(/,(.+)/);
}

function key(obj){
    return `${obj.name}&&&${obj.group}`
}


module.exports= url => download(url).then(res => parse(res).values());