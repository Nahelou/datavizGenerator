<template>
  <v-container>
    <h1 class="font-weight-light mb-10">Bubble Plot</h1>
    <v-select :items="Object.keys(featuresFields)" label="x value" @change="getXValue">
    </v-select>
    <v-select :items="Object.keys(featuresFields)" label="y value" @change="getYValue">
    </v-select>
    <v-select :items="Object.keys(featuresFields)" label="Label" @change="getLabelValue">
    </v-select>
    <v-select :items="Object.keys(featuresFields)" label="Size" @change="getSizeValue">
    </v-select>
    <div v-if="!isPackedData">
      <label for="colorpicker" class="mb-5">Color :</label>
      <input type="color" id="colorpicker" value="#0066ff" @change="changeColor">
    </div>
    <v-checkbox label="Color based on a field" @change="isPacked"></v-checkbox>
    <v-select v-if="isPackedData" :items="Object.keys(featuresFields)" label="Color field" @change="setPackingField">
    </v-select>

    <v-btn @click="processDataviz" right color="success" class="mb-10">
      Process
    </v-btn>
    <v-container v-if="isPackedData" style="max-height: 1000px">
      <v-row no-gutters>
        <v-col cols="6" md="2" style="max-height: 700px; overflow-y:scroll">
          <v-card class="pa-2" v-for="packingField in packingFieldData" :key="packingField">
            <v-row no-gutters>
              <v-col cols="6" md="6">
                <span>{{packingField}}</span>
              </v-col>
              <v-col cols="6" md="5">
                <input type="color" :id="packingField" class="colorpicker" :value="packingFieldColors[packingField].hex" @change="changePackingFieldColor">
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="10">
          <v-card class="pa-2">
            <div id="graphCanvas">
              <canvas id="bubbleChart"></canvas>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div v-if="!isPackedData" id="graphCanvas">
      <canvas id="bubbleChart"></canvas>
    </div>
  </v-container>
</template>

<script>
import Chart from "chart.js";
import * as d3 from "d3";
export default {
  name: "Bubble",
  dataOthers: null,
  props: {
    dataParsed: {
      type: Array,
    },
    fields: {
      type: Object,
    }
  },
  dataInOut: null,
  bubbleChartData: null,
  data() {
    return {
      dataArray: this.$props.dataParsed,
      featuresFields: this.$props.fields,
      fieldX: null,
      fieldY: null,
      fieldLabel: null,
      fieldSize: null,
      color: "rgba(0, 102, 255,.5)",
      isPackedData: false,
      packingField: null,
      packingFieldData: null,
      packingFieldColors: {},
    };
  },
  created() {
    this.dataArray = this.$props.dataParsed;
    this.featuresFields = this.$props.fields;
  },
  mounted() {},
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },
    //function to get chart data based on the selected parameters
    getChartData(){
      let that = this;
      let d = that.getDatasetsForChart();
      this.bubbleChartData = {
        type: "bubble",
        data: {
          datasets: d,
        },
        options: {
          legend: {
            labels: {
              fontColor: 'black'
            }
          },
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: this.fieldY,
                fontColor: 'black'
              },
              ticks: {
                beginAtZero: false,
                padding: 25,
                fontColor: 'black'
              },
            }, ],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: this.fieldX,
                fontColor: 'black'
              },
              ticks: {
                fontColor: 'black'
              },
            }, ],
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                let test = null;
                data.datasets[tooltipItem.datasetIndex].data.forEach((e) => {
                  if (e.x == parseFloat(tooltipItem.xLabel) && e.y == parseFloat(tooltipItem.yLabel)) {
                    test = e;
                  }
                });
                var label = test.label || ' : <br>' + test.x + ' : ' + test.pass;
                if (label) {
                  label += ': ';
                }
                label += that.fieldX + " : " + test.x;
                label += ";" + that.fieldY + " : " + test.y;
                return label;
              },
            },
            enabled: false,
            custom: function (tooltipModel) {
              var tooltipEl = document.getElementById('chartjs-tooltip');
              if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.innerHTML = '<table></table>';
                document.body.appendChild(tooltipEl);
              }
              if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
              }
              tooltipEl.classList.remove('above', 'below', 'no-transform');
              if (tooltipModel.yAlign) {
                tooltipEl.classList.add(tooltipModel.yAlign);
              } else {
                tooltipEl.classList.add('no-transform');
              }

              function getBody(bodyItem) {
                return bodyItem.lines;
              }
              if (tooltipModel.body) {
                var titleLines = tooltipModel.title || [];
                var bodyLines = tooltipModel.body.map(getBody);
                var innerHtml = '<thead>';
                titleLines.forEach(function (title) {
                  innerHtml += '<tr><th>' + title + '</th></tr>';
                });
                innerHtml += '</thead><tbody>';
                bodyLines.forEach(function (body, i) {
                  var colors = tooltipModel.labelColors[i];
                  var style = 'background:' + colors.backgroundColor;
                  style += '; border-color:' + colors.borderColor;
                  style += '; border-width: 2px';
                  var span = '<span style="' + style + '"></span>';
                  innerHtml += '<tr><td>' + span + body + '</td></tr>';
                });
                innerHtml += '</tbody>';
                var tableRoot = tooltipEl.querySelector('table');
                tableRoot.innerHTML = innerHtml;
              }
              var position = this._chart.canvas.getBoundingClientRect();
              tooltipEl.style.opacity = 1;
              tooltipEl.style.backgroundColor = "white";
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
              tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
              tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
            }
          },
        },
      };
    },
    getXValue(e) {
      this.fieldX = e;
    },
    getYValue(e) {
      this.fieldY = e;
    },
    getLabelValue(e) {
      this.fieldLabel = e;
    },
    getSizeValue(e) {
      this.fieldSize = e;
    },
    getColors(e) {
      this.colors = [];
      for (let i = 0; i < e.length; i++) {
        this.colors.push(this.color)
      }
    },
    getRandomColors(color, size) {
      let colors = [];
      for (let i = 0; i < size; i++) {
        colors.push(color);
      }
      return colors;
    },
    hexToRgbA(hex) {
      var c;
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)';
      }
      throw new Error('Bad Hex');
    },
    processDataviz() {
      document.getElementById("graphCanvas").innerHTML = "";
      let g = document.getElementById('graphCanvas');
      let canvas = document.createElement('canvas');
      canvas.id = "bubbleChart";

      g.appendChild(canvas);

      this.getColors(this.dataArray);
      this.getChartData();
      this.createChart("bubbleChart", this.bubbleChartData);
    },

    // create packing field unique value and correspondance color
    // @TODO create colors
    setPackingField(e) {
      this.packingFieldColors = {};
      this.packingField = e;
      this.packingFieldData = new Set();
      const that = this;
      for (let i = 0; i < this.dataArray.length; i++) {
        if (this.dataArray[i][e]) {
          this.packingFieldData.add(this.dataArray[i][e]);
          const color = '#' + (function co(lor){   return (lor +=
          [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
          && (lor.length == 6) ?  lor : co(lor); })('');
          const colors = {
            hex : color,
            rgb : that.hexToRgbA(color),
          };
          this.packingFieldColors[this.dataArray[i][e]] = colors;
        }
      }
      console.log(this.packingFieldData);
    },
    isPacked() {
      if (this.packingField) {
        this.packingField = null;
      }
      this.isPackedData = !this.isPackedData;
    },
    getDatasetsForChart() {
      let datasets = [];
      //data scale for the bubbles
      let dataToScale = [];
      if (this.packingField == null) {
        for (let i = 0; i < this.dataArray.length; i++) {
          let dataOthers = {};
          dataOthers.y = this.dataArray[i][this.fieldY];
          dataOthers.x = this.dataArray[i][this.fieldX];
          dataOthers.label = this.dataArray[i][this.fieldLabel];
          dataOthers.pass = this.dataArray[i][this.fieldSize];
          dataToScale.push(this.dataArray[i][this.fieldSize]);
          datasets.push(dataOthers);
        }
        let maxOut = d3.max(Object.values(dataToScale));
        let meanOut = d3.mean(Object.values(dataToScale));
        let minOut = d3.min(Object.values(dataToScale));
        let valued3 = d3
          .scaleLinear(10)
          .domain([minOut, meanOut, maxOut])
          .range([5, 10, 20, 50]);
        for (let j = 0; j < datasets.length; j++) {
          datasets[j].r = valued3(datasets[j].pass);
        }
        this.dataOthers = datasets;
        let dataset = [{
          label: "Dataset",
          data: datasets,
          backgroundColor: this.colors,
          borderColor: [],
          borderWidth: 1,
          }, 
          ];
        return dataset;
      } else {
        let datasetsPackedToChartProp = [];
        let datasetPacked = {};
        this.packingFieldData.forEach(field => {
          datasetPacked[field] = [];
        })

        // for each data, push it(prepared with x y label) in the correspondant's field object (datasetPacked[my data packing field value]) 
        for (let i = 0; i < this.dataArray.length; i++) {
          let dataPacked = {};
          dataPacked.y = this.dataArray[i][this.fieldY];
          dataPacked.x = this.dataArray[i][this.fieldX];
          dataPacked.label = this.dataArray[i][this.fieldLabel];
          dataPacked.pass = this.dataArray[i][this.fieldSize];
          dataToScale.push(this.dataArray[i][this.fieldSize]);
          if (this.dataArray[i][this.packingField]) {
            datasetPacked[this.dataArray[i][this.packingField]].push(dataPacked);
          }
        }
        //build props for each dataset
        for (let valuePacker in datasetPacked) {
          let datasetPackedToChartProp = {
            label: valuePacker,
            data: datasetPacked[valuePacker],
            backgroundColor: this.getRandomColors(this.packingFieldColors[valuePacker].rgb, datasetPacked[valuePacker].length),
            borderColor: [],
            borderWidth: 1,
          };
          datasetsPackedToChartProp.push(datasetPackedToChartProp);
        }
        //build the function to get a scale
        let maxOut = d3.max(Object.values(dataToScale));
        let meanOut = d3.mean(Object.values(dataToScale));
        let minOut = d3.min(Object.values(dataToScale));
        let valued3 = d3
          .scaleLinear(10)
          .domain([minOut, meanOut, maxOut])
          .range([5, 10, 20, 50]);
        // parse the dataset to calculate radius based on the scale
        for (let v in datasetPacked) {
          for (let j = 0; j < datasetPacked[v].length; j++) {
            datasetPacked[v][j].r = valued3(datasetPacked[v][j].pass);
          }
        }
        return datasetsPackedToChartProp;
      }
    },
    // change color of the dataviz (for just one color)
    changeColor(e) {
      let color = e.target.value || e.srcElement.value;
      this.color = this.hexToRgbA(color);
      return ;
    },
    // get random rgb color
    randomRgbColor() {
      var x = Math.floor(Math.random() * 256);
      var y = Math.floor(Math.random() * 256);
      var z = Math.floor(Math.random() * 256);
      var bgColor = "rgb(" + x + "," + y + "," + z + ", 0.5)";
      return bgColor;
    },
    //randomHexColor
    randomHexColor() {
      return '#' + Math.floor(Math.random()*16777215).toString(16);
    },
    //change color of the packing field (by value)
    changePackingFieldColor(e){
      let color = e.target.value || e.srcElement.value;
      let id = e.target.value.id || e.srcElement.id;
      this.packingFieldColors[id].rgb = this.hexToRgbA(color);
      this.processDataviz();
      return ;
    }
  },
};
</script>

<style>

</style>
