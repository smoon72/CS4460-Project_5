/*
    Four Regions across US
    Note about data, Delware not in
 */

var svg = d3.select('svg');
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var chartWidth = 600;
var chartHeight = 460;

var Northeast = ['Connecticut', 'Maine', 'Massachusetts', 'New Hampshire', 'New Jersey', 'New York', 'Pennsylvania',
    'Rhode Island', 'Vermont'];

var Midwest = ['Illinois', 'Indiana', 'Iowa', 'Kansas', 'Michigan', 'Minnesota', 'Missouri', 'Nebraska',
    'North Dakota', 'Ohio', 'South Dakota', 'Wisconsin' ];


var South = ['Alabama', 'Arkansas', 'Florida', 'Georgia', 'Kentucky', 'Louisiana', 'Maryland', 'Mississippi',
    'North Carolina', 'Oklahoma', 'South Carolina',  'Tennessee', 'Texas', 'Virginia', 'Washington DC','West Virginia'];

var West = ['Alaska', 'Arizona', 'California', 'Colorado', 'Hawaii', 'Idaho', 'Montana', 'Nevada', 'New Mexico',
    'Oregon', 'Utah', 'Washington', 'Wyoming'];


/*
    Candy Categories
 */
var Chocolate = ['Q6_Butterfinger', 'Q6_Heath_Bar', 'Q6_Hershey_s_Dark_Chocolate', 'Q6_Hershey_s_Milk_Chocolate',
'Q6_Hershey_s_Kisses', 'Q6_Junior_Mints', 'Q6_Kit_Kat', 'Q6_Milk_Duds', 'Q6_Milky_Way', 'Q6_Regular_M_Ms',
'Q6_Peanut_M_M_s', 'Q6_Mint_Kisses', 'Q6_Mr_Goodbar', 'Q6_Nestle_Crunch', 'Q6_Reese_s_Peanut_Butter_Cups',
'Q6_Reese_s_Pieces', 'Q6_Rolos', 'Q6_Snickers', 'Q6_Three_Musketeers', 'Q6_Tolberone_something_or_other',
'Q6_Twix', 'Q6_Whatchamacallit_Bars', 'Q6_York_Peppermint_Patties'];

var Fruit = ['Q6_Fuzzy_Peaches', 'Q6_Gummy_Bears_straight_up', 'Q6_Jolly_Rancher_bad_flavor',
'Q6_Jolly_Ranchers_good_flavor', 'Q6_LaffyTaffy', 'Q6_LemonHeads', 'Q6_Mike_and_Ike',
'Q6_Nerds', 'Q6_Pixy_Stix', 'Q6_Skittles', 'Q6_Sourpatch_Kids_i_e_abominations_of_nature',
'Q6_Starburst', 'Q6_Healthy_Fruit'];

var Other = ['Q6_Candy_Corn', 'Q6_Lollipops', 'Q6_Peeps', 'Q6_Swedish_Fish'];

var Gum = ['Q6_Chiclets', 'Q6_Dots', 'Q6_Tic_Tacs'];

var Licorice = ['Q6_Good_N_Plenty', 'Q6_Licorice_not_black', 'Q6_Licorice_yes_black'];

var Trail_Mix = ['Q6_Trail_Mix'];

var dataset = null;

var data_by_region_age_gender = null;



function get_candy_category(candy_string) {
  if (Chocolate.includes(candy_string)) {
    return "Chocolate";
  } else if (Fruit.includes(candy_string)) {
      return "Fruit";
  } else if (Other.includes(candy_string)) {
      return "Other";
  } else if (Gum.includes(candy_string)) {
      return "Gum";
  } else if (Licorice.includes(candy_string)) {
      return "Licorice";
  } else if (Trail_Mix.includes(candy_string)) {
      return "Trail_Mix";
  }
}

function get_region(state) {
  if (Northeast.includes(state)) {
    return "Northeast";
  } else if (Midwest.includes(state)) {
    return "Midwest";
  } else if (West.includes(state)) {
    return "Owest";
  } else if (South.includes(state)) {
      return "South";
  }
}

function get_age_group(age) {
  if (age < 18 ) {
    return "6-17";
  } else if (age < 35) {
    return "18-34";
  } else if (age < 60) {
    return "35-59";
  }
  return "60+";
}

function get_joy_value(joy_string) {
  if (joy_string == "JOY") {
    return 1.;
  } else if (joy_string == "MEH") {
    return 0.;
  }
  return -1.;
}

function get_category_joy(entry, category) {
  return d3.mean(category, function(d) {
      //console.log(d);
      //console.log(entry[d]);
     return get_joy_value(entry[d]);
  })
}

function get_joy_percentage(joy_value) {
  return (joy_value + 1)/2.
}

d3.csv('./data/us_candy.csv', function(error, __dataset){
    if(error) {
        console.error('Error while loading candy csv dataset.');
        console.error(error);
        return;
    }
    // **** Your JavaScript code goes here ***

    var i = 0;
    //console.log(__dataset);
    dataset = __dataset;

    data_by_region_age_gender = d3.nest()
        .key(function(d) {
          return get_region(d.Q5_STATE_PROVINCE_COUNTY_ETC);
        }).sortKeys(d3.ascending)
        .key(function(d) {
          return get_age_group(d.Q3_AGE);
        })
        .key(function(d) {
          return d.Q2_GENDER;
        }).sortKeys(d3.descending)
        .entries(dataset);

      console.log(data_by_region_age_gender);
    // console.log(get_category_joy(dataset[0], Trail_Mix));
    // console.log(get_category_joy(dataset[3], Trail_Mix));
    // console.log(get_category_joy(dataset[4], Trail_Mix));
    // console.log(get_category_joy(dataset[7], Trail_Mix));

    var choco_arr = [];
    var fruit_arr = [];
    var other_arr = [];
    var gum_arr = [];
    var licorice_arr = [];
    var trail_mix_arr = [];

    for (var a=0; a<data_by_region_age_gender.length; a++) {
        for (var b=0; b<data_by_region_age_gender[a].values.length; b++) {
            for (var c=0; c<data_by_region_age_gender[a].values[b].values.length; c++) {

                var c_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Chocolate);
                });
                choco_arr.push(c_num);

                var fruit_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Fruit);
                });
                fruit_arr.push(fruit_num);

                var other_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Other);
                });
                other_arr.push(other_num);

                var gum_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Gum);
                });
                gum_arr.push(gum_num);

                var licorice_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Licorice);
                });
                licorice_arr.push(licorice_num);

                var trail_mix_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Trail_Mix);
                });
                trail_mix_arr.push(trail_mix_num);


            }
        }

    }

    var regions_names = ['NE', 'MW', 'W', 'S'];
    var categories_names = [choco_arr, fruit_arr, other_arr, gum_arr, licorice_arr, trail_mix_arr];

    var bar_data = [];
    for (var i=0; i<4; i++) {
        bar_data.push({
            key: regions_names[i],
            value: categories_names[0].slice(i*8 ,i*8+8)
        });
    }

    /*
     X and Y axis for the bar chart
     */

    yScale = d3.scaleLinear()
        .range([chartHeight-40,0])
        .domain([-1, 1]);

    xScale = d3.scaleLinear()
        .range([0,chartWidth-170])
        .domain([-1, 1]);

    /*
        Rectangle
     */

    var padding = {t: 10, r: 20, b: 10, l: 20};
    var dum = ['A', 'B', 'C', 'D'];

    svg.selectAll('.background')
        .data(dum)
        .enter()
        .append('rect')
        .attr('class', 'background')
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('transform', function(d, i) {
            var tx = (i % 2) * (chartWidth + padding.l + padding.r) + padding.l;
            var ty = Math.floor(i / 2) * (chartHeight + padding.t + padding.b) + padding.t;
            return 'translate('+[tx, ty]+')';
        })
        .style('fill', 'white');

    var trellisG = svg.selectAll('.trellis')
        .data(data_by_region_age_gender)
        .enter()
        .append('g')
        .attr('class', 'trellis')
        .attr('transform', function (d, i) {
            // Use indices to space out the trellis groups in 2x2 matrix
            var tx = (i % 2) * (chartWidth + padding.l + padding.r) + padding.l;
            var ty = Math.floor(i / 2) * (chartHeight + padding.t + padding.b) + padding.t;
            return 'translate(' + [tx, ty] + ')';
        });


    /*
        Y and X Axis
     */

    xAxis = d3.axisBottom(xScale).ticks(0);
    trellisG.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(10,' + (chartHeight/2-10) + ')')
        .call(xAxis);

    yAxis = d3.axisLeft(yScale);
    trellisG.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(10,10)')
        .call(yAxis);

    /*
        Appending the rectangles
     */

    trellisSelection = svg.selectAll('.tSelections')
        .data(bar_data)
        .enter()
        .append('g')
        .attr('class', 'tSelections')
        .attr('transform', function (d, i) {
            // Use indices to space out the trellis groups in 2x2 matrix
            var tx = (i % 2) * (chartWidth + padding.l + padding.r) + padding.l;
            var ty = Math.floor(i / 2) * (chartHeight + padding.t + padding.b) + padding.t + 5;
            return 'translate(' + [tx, ty+5] + ')';
        });

    trellisSelection.selectAll('rect')
        .data(function (d) {
            return d.value;
        })
        .enter()
        .append('rect')
        .attr('x',  function (d,i) {
            if (i<=1) {
                return i*30 + 20;
            } else if (i<=3) {
                return i*30 + 40;
            } else if (i<=5) {
                return i*30 + 60;
            } else {
                return i*30 + 80;
            }
        })
        .attr('y', function (d) {
            if (d > 0) {
                return yScale(d);
            } else {
                return yScale(0);
            }
        })
        .attr('height', function (d) {
            return Math.abs(yScale(d)- yScale(0));
        })
        .attr('width', 30)
        .style('fill', function (d,i) {
            if (i%2==0) {
                return 'blue';
            } else {
                return 'pink';
            }
        });

    trellisG.append('text')
        .attr('class', 'citiesName')
        .attr('transform', 'translate(' + [170,40] + ')')
        .text(function (d) {
            if (d.key == 'Owest') {
                return 'West'
            }
            return d.key;
        });

    // var region_label = trellisSelection.selectAll('.region_label')
    //     .data(regions_names)
    //     .enter()
    //     .append('text')
    //     .attr('class', 'region_label');
    //
    // region_label.attr('translate', 'transform(100,0)')
    //     .text(function (d,i) {
    //         return d;
    //     });

    // console.log(choclate_mean);
    // console.log(fruit_mean);
    // console.log(other_mean);
    // console.log(gum_mean);
    // console.log(licorice_mean);
    // console.log(trail_mix_mean);
});














//
