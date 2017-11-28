dataset = null
d3.csv('./data/us_candy.csv', function(error, __dataset){
    if(error) {
        console.error('Error while loading candy csv dataset.');
        console.error(error);
        return;
    }
    // **** Your JavaScript code goes here ***

    console.log(__dataset);
    dataset = __dataset
    data_by_state = d3.nest()
        .key(function (d) {
            return d.Q5_STATE_PROVINCE_COUNTY_ETC;
        })
        .entries(dataset);

    console.log(data_by_state);
    console.log("done with nesting")
    setup();
});

function setup() {


}
