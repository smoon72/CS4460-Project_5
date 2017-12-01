// var ul = document.createElement('ul');
// ul.setAttribute('id','proList');
//



// var node = document.createElement("LI");                 // Create a <li> node
// var textnode = document.createTextNode("Water");         // Create a text node
//
// node.appendChild(textnode);
//
// var newUl = document.createElement("ol");
// var br = document.createElement("br");
//
// for (var c=0; c<Chocolate.length; c++) {
//     var s = Chocolate[c];
//
//     newUl.appendChild(document.createTextNode(s));
//     newUl.appendChild(br);
// }

//newUl.appendChild(textnode);

//var choco = document.getElementById("chocolate").appendChild(newUl);



//
// //var h1s = document.getElementsByTagName("h1").appendChild('ul');
// //console.log(h1s);

/*
    Four Regions across US
    Note about data, Delware not in
 */

var svg = d3.select('svg');
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var chartWidth = 450;
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
      //console.log(entry[d]);
      //console.log(d);
     return get_joy_value(entry[d]);
  })
}

function get_joy_percentage(joy_value) {
  return (joy_value + 1)/2.
}

var candy_counter = 0;

var choco_arr = [];
var fruit_arr = [];
var other_arr = [];
var gum_arr = [];
var licorice_arr = [];
var trail_mix_arr = [];

/*
    Keep track of number of values
 */
var choco_amount = [];
var fruit_amount = [];
var other_amount = [];
var gum_amount = [];
var licorice_amount = [];
var trail_mix_amount = [];


var regions_names = null;
var categories_names = null;
var categories_amount = null;
var candy_categories_names = null;

var choco_ranking = new Array(32);
var track = 0;

function formatPercent(d) {
    return d * 100 + "%";
}
function formatNoPercentage(d) {
    return d * 100;
}

d3.csv('./data/us_candy.csv', function(error, __dataset){
    if(error) {
        console.error('Error while loading candy csv dataset.');
        console.error(error);
        return;
    }

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

     //console.log(data_by_region_age_gender);

    for (var a=0; a<data_by_region_age_gender.length; a++) {
        for (var b=0; b<data_by_region_age_gender[a].values.length; b++) {
            for (var c=0; c<data_by_region_age_gender[a].values[b].values.length; c++) {

                var c_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d,i) {
                    return get_category_joy(d, Chocolate);
                });
                choco_arr.push(c_num);
                choco_amount.push(data_by_region_age_gender[a].values[b].values[c].values.length);

                var fruit_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Fruit);
                });
                fruit_arr.push(fruit_num);
                fruit_amount.push(data_by_region_age_gender[a].values[b].values[c].values.length);


                var other_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Other);
                });
                other_arr.push(other_num);
                other_amount.push(data_by_region_age_gender[a].values[b].values[c].values.length);


                var gum_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Gum);
                });
                gum_arr.push(gum_num);
                gum_amount.push(data_by_region_age_gender[a].values[b].values[c].values.length);


                var licorice_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Licorice);
                });
                licorice_arr.push(licorice_num);
                licorice_amount.push(data_by_region_age_gender[a].values[b].values[c].values.length);


                var trail_mix_num = d3.mean(data_by_region_age_gender[a].values[b].values[c].values, function (d) {
                    return get_category_joy(d, Trail_Mix);
                });
                trail_mix_arr.push(trail_mix_num);
                trail_mix_amount.push(data_by_region_age_gender[a].values[b].values[c].values.length);
            }
        }

    }

      /*
          Slicing data into its respective regions
       */
      regions_names = ['NE', 'MW', 'W', 'S'];
      categories_names = [choco_arr, fruit_arr, other_arr, gum_arr, licorice_arr, trail_mix_arr];
      categories_amount = [choco_amount, fruit_amount, other_amount, gum_amount, licorice_amount, trail_mix_amount];
      candy_categories_names = ['Chocolate', 'Fruit', 'Other', 'Gum', 'Licorice', 'Trail_Mix'];




      d3.graphScroll(0)
      	.graph(d3.selectAll('#graph'))
      	.container(d3.select('#container'))
        .sections(d3.selectAll('#sections > div'))
        .on('active', function(i){
            if (i<6) {
                drawMeanChart(i)
                console.log(i + 'th section active') ;
            }

        })
      drawMeanChart(0)

});


function drawMeanChart(scroll_number) {



  /*
      Candy Selector
   */


  var candy_name = [candy_categories_names[scroll_number]];
  var all_selected = categories_names[scroll_number];
  var all_amount_selected = categories_amount[scroll_number];

  //console.log(all_selected)

  var bar_data = [];
  for (var i=0; i<4; i++) {
      bar_data.push({
          key: regions_names[i],
          value: {


              bar_value: all_selected.slice(i * 8, i * 8 + 8),

              amount_of_people: all_amount_selected.slice(i * 8, i * 8 + 8)

          }
      });
  }
  //console.log(bar_data);

  /*
      Getting all the information into the all array
   */

  var all_array = [0,0,0,0,0,0,0,0];
  var num_array = [0,0,0,0,0,0,0,0];
  for (var j=0; j<32; j++) {
      all_array[j%8] = all_array[j%8] + all_selected[j];
      num_array[j%8] = num_array[j%8] + all_amount_selected[j];
  }

  for (var k =0; k<all_array.length; k++) {
      all_array[k] = all_array[k]/4;
  }

  /*
   X and Y axis for the bar chart
   */

  yScale = d3.scaleLinear()
      .range([chartHeight-40,0])
      .domain([-1, 1]);

  xScale = d3.scaleLinear()
      .range([0,chartWidth-20])
      .domain([-1, 1]);

  /*
      Rectangle
   */

  var padding = {t: 10, r: 20, b: 10, l: 40};
  var dum = ['A', 'B', 'C', 'D'];

  var all = [1];

  /*
      Regions rectangle
   */

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
          return 'translate(' + [tx+20, ty] + ')';
      });

  /*
      All category rectangle
   */
  svg.selectAll('.all_rect')
      .data(all)
      .enter()
      .append('rect')
      .attr('class', 'all_rect')
      .attr('width', chartWidth-20)
      .attr('height', chartHeight)
      .attr('transform', 'translate(1000,10)')
      .style('fill', 'white');

  var all_rect = svg.selectAll('.all')
      .data(all)
      .enter()
      .append('g')
      .attr('class', 'all')
      .attr('transform','translate(1100,10)');


  /*
      Y and X Axis
   */

  xAxis = d3.axisBottom(xScale).ticks(0);
  yAxis = d3.axisLeft(yScale).ticks(4).tickFormat(formatPercent);

  /*
      Axes for Regions
   */
  trellisG.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(10,' + (chartHeight/2-10) + ')')
      .call(xAxis);
  trellisG.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(10,10)')
      .call(yAxis);
  /*
   Axes for All
   */

  all_rect.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(10,' + (chartHeight/2-10) + ')')
      .call(xAxis);

  all_rect.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(10,' + 10 + ')')
      .call(yAxis);

  /*
      Appending the group to the rectangles
   */


    all_Selection = svg.selectAll('.allSelections')
        .data(all)
        .enter()
        .append('g')
        .attr('class', 'allSelections')
        .attr('transform', 'translate(1100,20)');




    // trellisSelection = svg.selectAll('.tSelections')
    //   .data(bar_data)
    //   .enter()
    //   .append('g')
    //   .attr('class', 'tSelections')
    //   .attr('transform', function (d, i) {
    //       // Use indices to space out the trellis groups in 2x2 matrix
    //       var tx = (i % 2) * (chartWidth + padding.l + padding.r) + padding.l;
    //       var ty = Math.floor(i / 2) * (chartHeight + padding.t + padding.b) + padding.t + 5;
    //       return 'translate(' + [tx, ty+5] + ')';
    //   });

    //var test = bar_data.value.bar_value;

    trellisSelection = svg.selectAll('.tSelections')
        .data(bar_data);
    trellisSelectionEnter = trellisSelection.enter()
        .append('g')
        .attr('class', 'tSelections')
        .attr('transform', function (d, i) {
            // Use indices to space out the trellis groups in 2x2 matrix
            var tx = (i % 2) * (chartWidth + padding.l + padding.r) + padding.l;
            var ty = Math.floor(i / 2) * (chartHeight + padding.t + padding.b) + padding.t + 5;
            return 'translate(' + [tx, ty + 5] + ')';
        });;

    trellisSelectionEnter.append('g');

    trellisSelection.merge(trellisSelectionEnter)
        .select('g');



    trellisSelection2 = trellisSelection.selectAll('.rrr')
        .data(function (d) {
            return d.value.bar_value;
        });
    trellisSelectionEnter = trellisSelection2.enter()
        .append('g')
        .attr('class', 'rrr');
    trellisSelectionEnter.append('rect');
    trellisSelectionEnter.append('text');
    trellisSelection2.merge(trellisSelectionEnter)
        .transition()
        .select('rect')
        /*
            Appending the rectangles
         */
  // trellisSelection.selectAll('rect')
  //     .data(function (d) {
  //         return d.value.bar_value;
  //     })
  //     .enter()
  //     .append('rect')
      .attr('x',  function (d,i) {
          //console.log(d)
          if (i<=1) {
              return i*45 + 20;
          } else if (i<=3) {
              return i*45 + 40;
          } else if (i<=5) {
              return i*45 + 60;
          } else {
              return i*45 + 80;
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
      .attr('width', 45)
      .style('fill', function (d,i) {
          if (i%2==0) {
              return '#00BFFF';
          } else {
              return 'pink';
          }
      })
      .attr('transform', 'translate(20,0)');

    trellisSelection2.merge(trellisSelectionEnter)
        .select('text')
        .attr('x', 430)
        .attr('y', 30)
        .text(function (d,i) {
            return Math.round(formatNoPercentage(d.toFixed(2))) + '%';
        })

  trellisSelection.selectAll('.textAmount')
      .data(function (d) {
          return d.value.amount_of_people;
      })
      .enter()
      .append('text')
      .attr('class', 'textAmount')
      .attr('x',  function (d,i) {
          //console.log(d);
          if (i<=1) {
              return i*40 + 30;
          } else if (i<=3) {
              return i*40 + 60;
          } else if (i<=5) {
              return i*40 + 90;
          } else {
              return i*40 + 120;
          }
      })
      .text(function (d) {
          return d;
      })
      .attr('transform', 'translate(30,205)');


    all_r = svg.selectAll('.r')
        .data(all_array);

  all_rEnter = all_r.enter()
        .append('g')
        .attr('class', 'r')
        .attr('transform', 'translate(1100,20)');


   all_rEnter.append('rect');

   all_r.merge(all_rEnter)
       .transition()
       .select('rect')
      .attr('x',  function (d,i) {
          if (i<=1) {
              return i*45 + 20;
          } else if (i<=3) {
              return i*45 + 40;
          } else if (i<=5) {
              return i*45 + 60;
          } else {
              return i*45 + 80;
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
      .attr('width', 45)
      .style('fill', function (d,i) {
          if (i%2==0) {
              return '#00BFFF';
          } else {
              return 'pink';
          }
      });


    all_Selection_texts = all_Selection.selectAll('.labels')
    .data(num_array)
    .enter()
    .append('g')
    .attr('class', 'labels');

    all_Selection_texts
    .append('text')
    .attr('x',  function (d,i) {
    if (i<=1) {
    return i*40 + 30;
    } else if (i<=3) {
    return i*40 + 60;
    } else if (i<=5) {
    return i*40 + 90;
    } else {
    return i*40 + 120;
    }
    })
    .text(function (d) {
    return d;
    })
    .attr('transform', 'translate(0,205)');


  // all_Selection.selectAll('text')
  //     .data(num_array)
  //     .enter()
  //     .append('text')
  //     .attr('x',  function (d,i) {
  //         //console.log(d);
  //         if (i<=1) {
  //             return i*40 + 30;
  //         } else if (i<=3) {
  //             return i*40 + 60;
  //         } else if (i<=5) {
  //             return i*40 + 90;
  //         } else {
  //             return i*40 + 120;
  //         }
  //     })
  //     .text(function (d) {
  //         return d;
  //     })
  //     .attr('transform', 'translate(90,205)');


  /*
      Labels on the graph
   */
  trellisG.append('text')
      .attr('class', 'citiesName')
      .attr('transform', 'translate(' + [170,40] + ')')
      .text(function (d) {
          if (d.key == 'Owest') {
              return 'West'
          }
          return d.key;
      });

  all_Selection.append('text')
      .attr('class', 'citiesName')
      .attr('transform', 'translate(' + [250,40] + ')')
      .text('All Regions');
}




function drawMeanUpdate(scroll_number) {


}








//
