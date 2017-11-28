dataset = null

var Northeast = ['Connecticut', 'Maine', 'Massachusetts', 'New Hampshire', 'Rhode Island', 'Vermont', 'New Jersey', 'New York',
'Pennslyvania'];

var Midwest = ['Illinois', 'Michigan', 'Ohio', 'Wisconsin', 'Iowa', 'Kansas', 'Minnesota', 'Missouri', 'Nebraska', 'North Dakota',
'South Dakota'];


var South = ['Delaware', 'Florida', 'Georgia', 'Maryland', 'North Caroline', 'South Carolina', 'Virginia', 'Washington DC', 'West Virginia',
'Alabama', 'Kentucky', 'Mississippi', 'Tennessee', 'Arkansas', 'Louisiana', 'Oklahoma', 'Texas'];

var West = ['Arizona', 'Colorado', 'Idaho', 'Montana', 'Nevada', 'New Mexico', 'Utah', 'Wyoming', 'Alaska', 'California', 'Hawaii', 'Oregon', 'Washington'];


d3.csv('./data/us_candy.csv', function(error, __dataset){
    if(error) {
        console.error('Error while loading candy csv dataset.');
        console.error(error);
        return;
    }
    // **** Your JavaScript code goes here ***

    //console.log(__dataset);
    dataset = __dataset
    data_by_state = d3.nest()
        .key(function (d) {
            return d.Q5_STATE_PROVINCE_COUNTY_ETC;
        })
        .entries(dataset);

    console.log(data_by_state);
    setup();
});

function setup() {

    var filterNE = data_by_state.filter(function (d,i) {
        if (Northeast.includes(d.key)) {
            return d.key;
        }
    });

    var filterMW = data_by_state.filter(function (d,i) {
        if (Midwest.includes(d.key)) {
            return d.key;
        }
    });

    var filterS = data_by_state.filter(function (d,i) {
        if (South.includes(d.key)) {
            return d.key;
        }
    });

    var filterW = data_by_state.filter(function (d,i) {
        if (West.includes(d.key)) {
            return d.key;
        }
    });

    // console.log('Northeast');
    // console.log(Northeast.length);
    // console.log(filterNE);
    //
    // console.log('Midwest');
    // console.log(Midwest.length);
    // console.log(filterMW);
    //
    // console.log('South');
    // console.log(South.length);
    // console.log(filterS);
    //
    // console.log('West');
    // console.log(West.length);
    // console.log(filterW);


}
